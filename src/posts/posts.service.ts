import { Injectable } from "@nestjs/common";
import { FirebaseService } from "src/firebase/firebase.service";
import { CreatePostDto } from "./dto/create-posts.dto";
import { auth } from "firebase-admin";

@Injectable()
export class PostsService {
    constructor(private readonly firebaseService: FirebaseService) { }
    async createPost(uid: string, data: CreatePostDto) {
        const db = this.firebaseService.getFirestore();

        // 🧩 Kiểm tra user tồn tại
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            throw new Error('User not found');
        }

        const userData = userDoc.data();

        // 🔑 Tạo sẵn id để dùng luôn trong post
        const postId = db.collection('posts').doc().id;

        const imageArray = Array.isArray(data.imageUrls)
            ? data.imageUrls
            : data.imageUrls
                ? [data.imageUrls]
                : [];
        // 🧱 Dữ liệu bài viết mới
        const newPost = {
            id: postId,                                 // ✅ thêm id trực tiếp
            authorId: uid,
            authorName: userData?.displayName || 'Ẩn danh',
            authorAvatar: userData?.photoURL || null,   // tùy chọn, hiển thị avatar
            authorMail: userData?.email || 'unknown', // email tác giả
            content: data.content.trim(),
            imageUrls: imageArray,            // đảm bảo là mảng
            likes: [],                                  // khởi tạo mảng rỗng
            commentCount: 0,                            // dễ thống kê
            createdAt: new Date().toISOString(),
            updatedAt: null,
        };

        // 💾 Lưu vào Firestore
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