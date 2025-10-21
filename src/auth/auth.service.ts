import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(private readonly firebaseService: FirebaseService) { }

    async createSession(idToken: string, res: Response) {
        if (!idToken) {
            throw new ForbiddenException('Thiếu ID token');
        }

        const auth = this.firebaseService.getAuth();
        const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 ngày

        try {
            // Xác minh token và tạo cookie
            const decoded = await auth.verifyIdToken(idToken);
            const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('session', sessionCookie, {
                httpOnly: true,
                secure: isProduction,              // ✅ chỉ bật HTTPS khi deploy
                sameSite: isProduction ? 'none' : 'lax', // ✅ cần 'none' để cookie hoạt động cross-domain
                maxAge: expiresIn,
                path: '/',
            });
            console.log("✅ Setting cookie session for uid:", decoded.uid);

            return { message: 'Session created successfully', uid: decoded.uid };
        } catch (error) {
            console.error('Error creating session:', error);
            throw new ForbiddenException('ID token không hợp lệ');
        }
    }

    async signupWithIdToken(idToken: string, data: CreateUserDto) {
        const decoded = await this.firebaseService.getAuth().verifyIdToken(idToken);
        return this.registerUser(decoded.uid, data);
    }

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

        if (!userDoc.exists) throw new NotFoundException('User not found');
        return userDoc.data();
    }

    async logout(res: Response) {
        try {
            // Xóa cookie 'session'
            const isProduction = process.env.NODE_ENV === 'production';
            res.clearCookie('session', {
                httpOnly: true,
                secure: isProduction,              // ✅ chỉ bật HTTPS khi deploy
                sameSite: isProduction ? 'none' : 'lax', // ✅ cần 'none' để cookie hoạt động cross-domain
                path: '/',
            });

            console.log('✅ Session cookie cleared');
            return { message: 'Đăng xuất thành công' };
        } catch (error) {
            console.error('Error clearing session cookie:', error);
            throw new ForbiddenException('Không thể đăng xuất');
        }
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

    async assertAdmin(uid: string) {
        const isAdmin = await this.isAdmin(uid);
        if (!isAdmin) {
            throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
        }
        return true;
    }
}
