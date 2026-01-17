"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFiles = exports.configureBucket = exports.handleTranscodeUpdate = exports.startTranscode = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const video_transcoder_1 = require("@google-cloud/video-transcoder");
const transcoderServiceClient = new video_transcoder_1.TranscoderServiceClient();
// Configuration
const REGION = "us-central1";
const PROJECT_ID = process.env.GCLOUD_PROJECT;
exports.startTranscode = functions.storage.object().onFinalize(async (object) => {
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
    }
    catch (error) {
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
        labels,
        config: {
            pubsubDestination: {
                topic: `projects/${PROJECT_ID}/topics/transcoder-updates`
            }
        }
    };
    try {
        const [response] = await transcoderServiceClient.createJob({
            parent: transcoderServiceClient.locationPath(PROJECT_ID, REGION),
            job: job,
        });
        console.log(`Transcoder job created: ${response.name}`);
    }
    catch (error) {
        console.error("Error creating transcoder job:", error);
        await admin.firestore().collection("videos").doc(movieId).update({
            status: "Error"
        });
    }
});
exports.handleTranscodeUpdate = functions.pubsub.topic("transcoder-updates").onPublish(async (message) => {
    var _a, _b;
    let data;
    try {
        data = message.json;
    }
    catch (e) {
        console.error("PubSub message was not JSON", e);
        return;
    }
    console.log("Received Transcoder Update:", JSON.stringify(data));
    const state = (_a = data.job) === null || _a === void 0 ? void 0 : _a.state; // SUCCEEDED, FAILED
    const labels = (_b = data.job) === null || _b === void 0 ? void 0 : _b.labels;
    const movieId = labels === null || labels === void 0 ? void 0 : labels.movieid;
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
    }
    else if (state === "FAILED") {
        console.error(`Job Failed for movie ${movieId}. Failure reason:`, data.job.error);
        await admin.firestore().collection("videos").doc(movieId).update({
            status: "Error"
        });
    }
});
exports.configureBucket = functions.https.onRequest(async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error configuring bucket: " + JSON.stringify(error));
    }
});
exports.listFiles = functions.https.onRequest(async (req, res) => {
    const bucket = admin.storage().bucket();
    const prefix = req.query.prefix || "";
    try {
        const [files] = await bucket.getFiles({ prefix });
        const fileNames = files.map(f => f.name);
        res.json({ prefix, files: fileNames });
    }
    catch (error) {
        res.status(500).json({ error: JSON.stringify(error) });
    }
});
//# sourceMappingURL=transcode.js.map