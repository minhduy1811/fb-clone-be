import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { firestore } from 'firebase-admin';

@Injectable()
export class CommentsService {
    constructor(private readonly firebaseService: FirebaseService) {
    }

    // 🟢 Tạo comment
    async addComment(postId: string, data: any) {

        const db = this.firebaseService.getFirestore();
        const postRef = db.collection('posts').doc(postId);
        const postDoc = await postRef.get();
        if (!postDoc.exists) throw new Error('Post not found');
        const userData = postDoc.data();
        const commentRef = postRef.collection('comments').doc();
        if (!data?.content) {
            throw new Error('Thiếu nội dung bình luận');
        }

        if (!userData?.authorId) {
            console.warn('⚠️ Post không có authorId:', postId);
        }
        const commentData = {
            id: commentRef.id,
            postId: userData?.id,
            userId: userData?.authorId,
            userName: userData?.authorName || 'Ẩn danh',
            userAvatar: userData?.authorAvatar || null,
            content: data.content,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            isEdited: false,
        };

        await commentRef.set(commentData);

        // 🔄 Cập nhật tổng comment trong post
        await postRef.update({
            commentCount: firestore.FieldValue.increment(1),
        });

        return commentData;
    }

    // 🟡 Lấy tất cả comment
    async getComments(postId: string) {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('createdAt', 'asc')
            .get();

        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    // 🟠 Cập nhật comment
    async updateComment(postId: string, commentId: string, newContent: string) {
        const db = this.firebaseService.getFirestore();
        const ref = db.collection('posts').doc(postId).collection('comments').doc(commentId);
        await ref.update({
            content: newContent,
            updatedAt: firestore.FieldValue.serverTimestamp(),
            isEdited: true,
        });
        return { message: 'Comment updated' };
    }

    // 🔴 Xoá comment
    async deleteComment(postId: string, commentId: string) {
        const db = this.firebaseService.getFirestore();
        const postRef = db.collection('posts').doc(postId);
        const commentRef = postRef.collection('comments').doc(commentId);

        await commentRef.delete();
        await postRef.update({
            commentCount: firestore.FieldValue.increment(-1),
        });

        return { message: 'Comment deleted' };
    }
}
