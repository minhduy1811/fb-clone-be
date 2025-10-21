import { Controller, Get, Delete, Patch, Param, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FirebaseSessionGuard } from 'src/common/guards/firebase-session.guard';

@UseGuards(FirebaseSessionGuard, RolesGuard)
@Roles('admin')
@Controller('admin/posts')
export class AdminPostsController {
    constructor(private readonly postsService: PostsService) { }
    @Get()
    async getAllPosts() {
        return this.postsService.getAllPosts();
    }
    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        return this.postsService.deletePost(id);
    }
}
