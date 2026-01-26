import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { Firestore } from "@google-cloud/firestore";
import { TranscoderServiceClient } from "@google-cloud/video-transcoder";

// Initialize the specific database
// const db = getFirestore("helastream"); // Moved inside functions to ensure init


const transcoderServiceClient = new TranscoderServiceClient();

// Configuration (Updated for Adaptive Streaming)
const REGION = "us-central1";
// Hardcoded Project ID to prevent Runtime failures
const PROJECT_ID = "sonorous-asset-484412-n3";

export const startTranscode = functions.storage.object().onFinalize(async (object: functions.storage.ObjectMetadata) => {
    const db = new Firestore({ projectId: PROJECT_ID, databaseId: "helastream" });
    const contentType = object.contentType;
    const filePath = object.name;

    // 1. Validation
    if (!filePath || !contentType || !contentType.startsWith("video/")) {
        console.log("Not a video or no file path.");
        return;
    }

    // Expected path: videos/{movieId}/{filename}
    // We strictly only capture uploads to 'videos/' folder to avoid loops
    const parts = filePath.split("/");
    if (parts.length < 3 || parts[0] !== "videos") {
        console.log("File not in 'videos' folder structure. Ignoring.");
        return;
    }

    const movieId = parts[1];
    const fileName = parts[parts.length - 1];

    console.log(`Starting transcode for movie: ${movieId}, file: ${fileName}`);

    // 2. Set Status to Processing
    try {
        await db.collection("videos").doc(movieId).update({
            status: "Processing"
        });
    } catch (error) {
        console.error("Failed to update Firestore status:", error);
    }

    // 3. Create Transcoder Job
    const inputUri = `gs://${object.bucket}/${filePath}`;
    const outputUri = `gs://${object.bucket}/processed/${movieId}/`;

    // Ensure labels are strings
    const labels = {
        movieid: movieId.toLowerCase() // Labels must be lowercase
    };

    const job = {
        inputUri,
        outputUri,
        // templateId: "preset/web-hd", // Removed simple preset
        labels,
        config: {
            pubsubDestination: {
                topic: `projects/${PROJECT_ID}/topics/transcoder-updates`
            },
            elementaryStreams: [
                {
                    key: "video-stream0",
                    videoStream: {
                        h264: {
                            heightPixels: 360,
                            widthPixels: 640,
                            bitrateBps: 550000,
                            frameRate: 30,
                            profile: "high"
                        }
                    }
                },
                {
                    key: "video-stream1",
                    videoStream: {
                        h264: {
                            heightPixels: 720,
                            widthPixels: 1280,
                            bitrateBps: 2500000,
                            frameRate: 30,
                            profile: "high"
                        }
                    }
                },
                {
                    key: "video-stream2",
                    videoStream: {
                        h264: {
                            heightPixels: 1080,
                            widthPixels: 1920,
                            bitrateBps: 5000000,
                            frameRate: 30,
                            profile: "high"
                        }
                    }
                },
                {
                    key: "audio-stream0",
                    audioStream: {
                        codec: "aac",
                        bitrateBps: 64000,
                        channelCount: 2,
                        sampleRateHertz: 48000
                    }
                }
            ],
            muxStreams: [
                {
                    key: "sd",
                    container: "ts",
                    elementaryStreams: ["video-stream0", "audio-stream0"]
                },
                {
                    key: "hd",
                    container: "ts",
                    elementaryStreams: ["video-stream1", "audio-stream0"]
                },
                {
                    key: "fhd",
                    container: "ts",
                    elementaryStreams: ["video-stream2", "audio-stream0"]
                }
            ],
            manifests: [
                {
                    fileName: "manifest.m3u8",
                    type: "HLS",
                    muxStreams: ["sd", "hd", "fhd"]
                }
            ]
        }
    };

    try {
        const [response] = await transcoderServiceClient.createJob({
            parent: transcoderServiceClient.locationPath(PROJECT_ID!, REGION),
            job: job as any,
        });

        console.log(`Transcoder job created: ${response.name}`);

        // Save the Job ID to Firestore so we can track it later
        await db.collection("videos").doc(movieId).update({
            transcodeJobId: response.name
        });
    } catch (error) {
        console.error("Error creating transcoder job:", error);
        await db.collection("videos").doc(movieId).update({
            status: "Error"
        });
    }
});

export const handleTranscodeUpdate = functions.pubsub.topic("transcoder-updates").onPublish(async (message: functions.pubsub.Message) => {
    const db = new Firestore({ projectId: PROJECT_ID, databaseId: "helastream" });
    let data: any;
    try {
        data = message.json;
    } catch (e) {
        console.error("PubSub message was not JSON", e);
        return;
    }

    console.log("Received Transcoder Update:", JSON.stringify(data));

    const jobName = data.job?.name;
    const state = data.job?.state; // SUCCEEDED, FAILED

    if (!jobName) {
        console.error("No job name found in update.");
        return;
    }

    // Lookup the movie by transcodeJobId because labels force lowercase, breaking the ID
    const snapshot = await db.collection("videos").where("transcodeJobId", "==", jobName).get();

    if (snapshot.empty) {
        console.error(`No movie found with transcodeJobId: ${jobName}`);
        return;
    }

    const movieDoc = snapshot.docs[0];
    const movieId = movieDoc.id;

    console.log(`Matched Job ${jobName} to Movie ID: ${movieId}`);

    if (state === "SUCCEEDED") {
        // Construct the HLS URL using known bucket and movieId
        // PubSub only receives job name and state, not full config, so we construct the URL ourselves
        const bucketName = `${PROJECT_ID}.firebasestorage.app`;
        const hlsUrl = `https://storage.googleapis.com/${bucketName}/processed/${movieId}/manifest.m3u8`;

        console.log(`[DEBUG] Constructed HLS URL: ${hlsUrl}`);
        console.log(`[DEBUG] Updating Firestore for movieId: ${movieId}`);

        await db.collection("videos").doc(movieId).update({
            status: "Ready",
            videoUrl: hlsUrl
        });

        console.log(`[DEBUG] Firestore updated successfully for ${movieId}`);

    } else if (state === "FAILED") {
        console.error(`Job Failed for movie ${movieId}. Failure reason:`, data.job.error);

        await db.collection("videos").doc(movieId).update({
            status: "Error"
        });
    }
});

export const configureBucket = functions.https.onRequest(async (req, res) => {
    const bucket = admin.storage().bucket();

    try {
        // 1. Configure CORS
        await bucket.setCorsConfiguration([
            {
                origin: ["*"],
                method: ["GET"],
                responseHeader: ["Content-Type"],
                maxAgeSeconds: 3600
            }
        ]);
        console.log("CORS configured.");

        // 2. Make Bucket Public
        await bucket.makePublic();

        res.send(`Bucket ${bucket.name} configured: CORS set and Public Access granted.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error configuring bucket: " + JSON.stringify(error));
    }
});

export const listFiles = functions.https.onRequest(async (req, res) => {
    const bucket = admin.storage().bucket();
    const prefix = req.query.prefix as string || "";

    try {
        const [files] = await bucket.getFiles({ prefix });
        const fileNames = files.map(f => f.name);
        res.json({ prefix, files: fileNames });
    } catch (error) {
        res.status(500).json({ error: JSON.stringify(error) });
    }
});

export const checkTranscodeStatus = functions.https.onRequest(async (req, res) => {
    const db = new Firestore({ projectId: PROJECT_ID, databaseId: "helastream" });
    const movieId = req.query.movieId as string;

    if (!movieId) {
        res.status(400).send("Missing movieId query parameter");
        return;
    }

    try {
        // 1. Get Movie Doc
        const movieDoc = await db.collection("videos").doc(movieId).get();
        if (!movieDoc.exists) {
            res.status(404).send("Movie not found");
            return;
        }

        const movieData = movieDoc.data();
        const jobId = movieData?.transcodeJobId;

        if (!jobId) {
            res.status(404).send("No Transcode Job ID found for this movie.");
            return;
        }

        console.log(`Checking status for job: ${jobId}`);

        // 2. Get Job Status from Google Cloud
        const [job] = await transcoderServiceClient.getJob({ name: jobId });
        const state = job.state;
        const error = job.error;

        console.log(`Current Job State: ${state}`);

        // [DEBUG] Include current Firestore State in response
        const currentFirestoreData = {
            status: movieData?.status,
            videoUrl: movieData?.videoUrl,
            jobId: jobId
        };

        if (state === "SUCCEEDED") {
            const bucket = job.config!.output!.uri!.split("/")[2];
            const outputDir = job.config!.output!.uri!.split(bucket)[1];
            const hlsUrl = `https://storage.googleapis.com/${bucket}${outputDir}manifest.m3u8`;

            await db.collection("videos").doc(movieId).update({
                status: "Ready",
                videoUrl: hlsUrl
            });

            res.json({ status: "SUCCEEDED", videoUrl: hlsUrl, firestore: currentFirestoreData });

        } else if (state === "FAILED") {
            await db.collection("videos").doc(movieId).update({
                status: "Error"
            });
            res.json({ status: "FAILED", error: error?.message, firestore: currentFirestoreData });
        } else {
            // PROCESSING, PENDING, etc.
            res.json({ status: state, firestore: currentFirestoreData });
        }

    } catch (error: any) {
        console.error("Error checking transcode status:", error);
        res.status(500).send("Internal Server Error: " + (error.message || JSON.stringify(error)));
    }
});
// [DEBUG] Manual Force Update Endpoint
export const debugForceUpdate = functions.https.onRequest(async (req, res) => {
    // Explicitly use the hardcoded PROJECT_ID
    const targetProject = PROJECT_ID;

    // Diagnostic Fallback DBs
    const db = new Firestore({ projectId: targetProject, databaseId: "helastream" });
    const dbDefault = new Firestore({ projectId: targetProject }); // Default DB

    const movieId = req.query.movieId as string;
    const hlsUrl = req.query.hlsUrl as string;

    const logs: string[] = [];
    const log = (msg: string) => { console.log(msg); logs.push(msg); };

    log(`[DIAGNOSTIC] env.GCLOUD_PROJECT: ${process.env.GCLOUD_PROJECT}`);
    log(`[DIAGNOSTIC] targetProject: ${targetProject}`);

    // Helper to check DB accessibility
    const checkDb = async (name: string, database: Firestore) => {
        try {
            log(`[DIAGNOSTIC] Checking accessibility of DB: '${name}'...`);
            const collections = await database.listCollections();
            const colIds = collections.map(c => c.id);
            log(`[DIAGNOSTIC] DB '${name}' Connected! Collections: [${colIds.join(", ")}]`);
            return { accessible: true, collections: colIds };
        } catch (e: any) {
            log(`[DIAGNOSTIC] DB '${name}' Connection FAILED: ${e.message}`);
            return { accessible: false, error: e };
        }
    };

    // 1. Check Default
    const defaultStatus = await checkDb("(default)", dbDefault);

    // 2. Check Helastream
    const helastreamStatus = await checkDb("helastream", db);

    // Decide which one to use
    let activeDb: Firestore | null = null;
    let activeDbName = "";

    if (helastreamStatus.accessible && helastreamStatus.collections?.includes("videos")) {
        activeDb = db;
        activeDbName = "helastream";
    } else if (defaultStatus.accessible && defaultStatus.collections?.includes("videos")) {
        activeDb = dbDefault;
        activeDbName = "(default)";
    }

    if (!activeDb) {
        res.status(500).send(`DIAGNOSTIC FAILURE.\n\nLogs:\n${logs.join("\n")}`);
        return;
    }

    if (!movieId || !hlsUrl) {
        res.send(`DIAGNOSTIC SUCCESS. Active DB appears to be: ${activeDbName}\n\nLogs:\n${logs.join("\n")}`);
        return;
    }

    // Perform Update on the Active DB
    try {
        log(`[ACTION] Updating ${movieId} in ${activeDbName}...`);
        const docRef = activeDb.collection("videos").doc(movieId);

        // Check existence
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            res.status(404).send(`Doc ${movieId} NOT FOUND in ${activeDbName}.\n\nLogs:\n${logs.join("\n")}`);
            return;
        }

        await docRef.update({
            status: "Ready",
            videoUrl: hlsUrl,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        res.send(`SUCCESS: Updated ${movieId} in ${activeDbName} to ${hlsUrl}`);
    } catch (error: any) {
        res.status(500).send(`UPDATE FAILED in ${activeDbName}: ${error.message}\n\nLogs:\n${logs.join("\n")}`);
    }
});
