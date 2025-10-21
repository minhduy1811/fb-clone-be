import { Injectable } from "@nestjs/common";
import { FirebaseService } from "src/firebase/firebase.service";
import { CreatePostDto } from "./dto/create-posts.dto";
import { auth } from "firebase-admin";

@Injectable()
export class PostsService {
    constructor(private readonly firebaseService: FirebaseService) { }
    async createPost(uid: string, data: CreatePostDto) {
        const db = this.firebaseService.getFirestore();
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        const userData = userDoc.data();
        const postId = db.collection('posts').doc().id;

        const imageArray = Array.isArray(data.imageUrls)
            ? data.imageUrls
            : data.imageUrls
                ? [data.imageUrls]
                : [];
        const newPost = {
            id: postId,
            authorId: uid,
            authorName: userData?.displayName || 'Ẩn danh',
            authorAvatar: userData?.photoURL || null,
            authorMail: userData?.email || 'unknown',
            content: data.content.trim(),
            imageUrls: imageArray,
            likes: [],
            createdAt: new Date().toISOString(),
            updatedAt: null,
        };
        await db.collection('posts').doc(postId).set(newPost);

        console.log(`✅ New post created by ${uid}: ${data.imageUrls}`);
        return newPost;
    }
    async getUserPosts(uid: string) {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db
            .collection('posts')
            .where('authorId', '==', uid)
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                imageUrls: Array.isArray(data.imageUrls)
                    ? data.imageUrls
                    : data.imageUrls
                        ? [data.imageUrls]
                        : [],
            };
        });
    }
    async getAllPosts() {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async deletePost(id: string) {
        const db = this.firebaseService.getFirestore();
        await db.collection('posts').doc(id).delete();
        return { message: 'Post deleted successfully' };
    }
    async updatePost(id: string, data: CreatePostDto) {
        const db = this.firebaseService.getFirestore();
        const postRef = db.collection('posts').doc(id);
        await postRef.update({
            content: data.content.trim(),
            imageUrls: Array.isArray(data.imageUrls)
                ? data.imageUrls
                : data.imageUrls
                    ? [data.imageUrls]
                    : [],
            updatedAt: new Date().toISOString(),
        });
        const updatedPost = await postRef.get();
        return { id: updatedPost.id, ...updatedPost.data() };
    }
}