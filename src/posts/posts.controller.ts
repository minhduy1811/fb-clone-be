import { CreatePostDto } from "./dto/create-posts.dto";
import { Post, Req, Get, Body, Controller, UseGuards, UseInterceptors, UploadedFile, Delete, Param, Put } from "@nestjs/common";
import { PostsService } from './posts.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from "@nestjs/platform-express";
import { FirebaseSessionGuard } from "src/common/guards/firebase-session.guard";

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService,
        private readonly cloudinaryService: CloudinaryService,) { };

    @UseGuards(FirebaseSessionGuard)
    @Post()
    async createPost(@Req() req, @Body() body: CreatePostDto) {
        const uid = req.user.uid;
        return this.postsService.createPost(uid, body);
    }
    @UseGuards(FirebaseSessionGuard)
    @Get()
    async getAllPosts(@Req() req) {
        const uid = req.user.uid;
        return this.postsService.getUserPosts(uid);
    }
    @UseGuards(FirebaseSessionGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const result = await this.cloudinaryService.uploadImage(file);
        return { url: result.secure_url };
    }
    @UseGuards(FirebaseSessionGuard)
    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        return this.postsService.deletePost(id);
    }
    @UseGuards(FirebaseSessionGuard)
    @Put(':id')
    async updatePost(@Param('id') id: string, @Body() body: CreatePostDto) {
        return this.postsService.updatePost(id, body);
    }
}

