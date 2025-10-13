import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

import * as serviceAccount from "../firebase-service-account.json";
// file này bạn tải từ Firebase Console → Project Settings → Service Account

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export const firestore = admin.firestore();
export const auth = admin.auth();
