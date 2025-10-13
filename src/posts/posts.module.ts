import { Controller, Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { FirebaseModule } from "src/firebase/firebase.module";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { AdminPostsController } from "./admin-post.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [FirebaseModule, CloudinaryModule, AuthModule],
    controllers: [PostsController, AdminPostsController],
    providers: [PostsService],
})

export class PostsModule { }
