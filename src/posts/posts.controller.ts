import { CreatePostDto } from "./dto/create-posts.dto";
import { Post, Req, Get, Body, Controller, UseGuards, UseInterceptors, UploadedFile } from "@nestjs/common";
import { PostsService } from './posts.service';
import { FirebaseAuthGuard } from "src/auth/firebase-auth.guard";
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService,
        private readonly cloudinaryService: CloudinaryService,) { };

    @UseGuards(FirebaseAuthGuard)
    @Post()
    async createPost(@Req() req, @Body() body: CreatePostDto) {
        const uid = req.user.uid;
        return this.postsService.createPost(uid, body);
    }
    @UseGuards(FirebaseAuthGuard)
    @Get()
    async getAllPosts(@Req() req) {
        const uid = req.user.uid;
        return this.postsService.getUserPosts(uid);
    }
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const result = await this.cloudinaryService.uploadImage(file);
        return { url: result.secure_url };
    }
}

