
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// You will need to download your service account key from Project Settings -> Service Accounts
// and set the content to the FIREBASE_SERVICE_ACCOUNT_KEY env var
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : {};

export function getAdminApp() {
    if (!getApps().length) {
        return initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
    }
    return getApp();
}

/**
 * Get Firestore Admin instance
 */
export function getAdminDb() {
    const app = getAdminApp();
    return getFirestore(app);
}
