// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AdminService {
    constructor(private readonly firebaseService: FirebaseService) { }

    async getAllUsers() {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return {
            count: users.length,
            users,
        };
    }

}
