import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { TranscoderServiceClient } from "@google-cloud/video-transcoder";

const transcoderServiceClient = new TranscoderServiceClient();

// Configuration
const REGION = "us-central1";
const PROJECT_ID = process.env.GCLOUD_PROJECT;

export const startTranscode = functions.storage.object().onFinalize(async (object: functions.storage.ObjectMetadata) => {
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
        await admin.firestore().collection("videos").doc(movieId).update({
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
        movieid: movieId // Labels must be lowercase
    };

    const job = {
        inputUri,
        outputUri,
        templateId: "preset/web-hd",
        labels, // Attach label so we can identify it later
        config: {
            pubsubDestination: {
                topic: `projects/${PROJECT_ID}/topics/transcoder-updates`
            }
        }
    };

    try {
        const [response] = await transcoderServiceClient.createJob({
            parent: transcoderServiceClient.locationPath(PROJECT_ID!, REGION),
            job: job as any,
        });

        console.log(`Transcoder job created: ${response.name}`);

        // Save the Job ID to Firestore so we can track it later
        await admin.firestore().collection("videos").doc(movieId).update({
            transcodeJobId: response.name
        });
    } catch (error) {
        console.error("Error creating transcoder job:", error);
        await admin.firestore().collection("videos").doc(movieId).update({
            status: "Error"
        });
    }
});

export const handleTranscodeUpdate = functions.pubsub.topic("transcoder-updates").onPublish(async (message: functions.pubsub.Message) => {
    let data;
    try {
        data = message.json;
    } catch (e) {
        console.error("PubSub message was not JSON", e);
        return;
    }

    console.log("Received Transcoder Update:", JSON.stringify(data));

    const state = data.job?.state; // SUCCEEDED, FAILED
    const labels = data.job?.labels;
    const movieId = labels?.movieid;

    if (!movieId) {
        console.error("No movieId label found in job update.");
        return;
    }

    if (state === "SUCCEEDED") {
        // Construct the HLS URL
        // HLS preset 'preset/web-hd' creates a 'manifest.m3u8' in the output directory
        const bucket = data.job.config.output.uri.split("/")[2]; // gs://bucket/...
        const outputDir = data.job.config.output.uri.split(bucket)[1]; // /processed/{movieId}/

        // Public Access URL (assuming bucket is public or signed URLs - for HLS public is best for prototyping)
        // Alternatively, use CloudFront/CDN. Here we use storage.googleapis.com
        const hlsUrl = `https://storage.googleapis.com/${bucket}${outputDir}manifest.m3u8`;

        console.log(`Job Succeeded. Updating movie ${movieId} with URL ${hlsUrl}`);

        await admin.firestore().collection("videos").doc(movieId).update({
            status: "Ready",
            videoUrl: hlsUrl
        });

    } else if (state === "FAILED") {
        console.error(`Job Failed for movie ${movieId}. Failure reason:`, data.job.error);

        await admin.firestore().collection("videos").doc(movieId).update({
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
    const movieId = req.query.movieId as string;

    if (!movieId) {
        res.status(400).send("Missing movieId query parameter");
        return;
    }

    try {
        // 1. Get Movie Doc
        const movieDoc = await admin.firestore().collection("videos").doc(movieId).get();
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

        if (state === "SUCCEEDED") {
            const bucket = job.config!.output!.uri!.split("/")[2];
            const outputDir = job.config!.output!.uri!.split(bucket)[1];
            const hlsUrl = `https://storage.googleapis.com/${bucket}${outputDir}manifest.m3u8`;

            await admin.firestore().collection("videos").doc(movieId).update({
                status: "Ready",
                videoUrl: hlsUrl
            });

            res.json({ status: "SUCCEEDED", videoUrl: hlsUrl });

        } else if (state === "FAILED") {
            await admin.firestore().collection("videos").doc(movieId).update({
                status: "Error"
            });
            res.json({ status: "FAILED", error: error?.message });
        } else {
            // PROCESSING, PENDING, etc.
            res.json({ status: state });
        }

    } catch (error) {
        console.error("Error checking transcode status:", error);
        res.status(500).send("Internal Server Error: " + JSON.stringify(error));
    }
});
