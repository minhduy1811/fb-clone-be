import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class AuthService {
    constructor(private readonly firebaseService: FirebaseService) { }

    async registerUser(uid: string, data: CreateUserDto) {
        const db = this.firebaseService.getFirestore();
        const userRef = db.collection('users').doc(uid);
        await userRef.set({
            email: data.email,
            displayName: data.displayName || '',
            gender: data.gender || '',
            birthdate: data.birthdate || '',
            createdAt: new Date().toISOString(),
            role: data.role || 'user',
        });
        return { message: 'User created successfully' };
    }

    async getUser(uid: string) {
        const db = this.firebaseService.getFirestore();
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return { message: 'User not found' };
        }

        return userDoc.data();
    }

    async isAdmin(uid: string): Promise<boolean> {
        const db = this.firebaseService.getFirestore();
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            throw new NotFoundException('User not found');
        }

        const role = userDoc.data()?.role;
        return role === 'admin';
    }

    /**
     * Xác minh quyền admin - dùng trong các route quan trọng
     */
    async assertAdmin(uid: string) {
        const isAdmin = await this.isAdmin(uid);
        if (!isAdmin) {
            throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
        }
        return true;
    }
}
