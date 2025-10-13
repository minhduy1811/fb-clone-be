import { Controller, Module } from "@nestjs/common";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { FirebaseModule } from "src/firebase/firebase.module";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
    imports: [FirebaseModule],
    controllers: [CommentsController],
    providers: [CommentsService],
})

export class CommentsModule { }