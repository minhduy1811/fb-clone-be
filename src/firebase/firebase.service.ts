import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private app: admin.app.App;

    onModuleInit() {
        if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT không được cấu hình. Vui lòng kiểm tra biến môi trường.');
        }

        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');


        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }

        if (!admin.apps.length) {
            this.app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('✅ Firebase Admin initialized');
        } else {
            this.app = admin.app();
            console.log('⚡ Firebase app already initialized');
        }
    }

    getAuth() {
        return admin.auth(this.app);
    }

    getFirestore() {
        if (!this.app) {
            throw new Error('❌ Firebase app chưa được khởi tạo');
        }
        return admin.firestore(this.app);
    }

    async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
        try {
            return await admin.auth().verifyIdToken(token);
        } catch (error) {
            console.error('Error verifying token:', error);
            throw error;
        }
    }
}