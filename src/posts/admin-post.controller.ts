import { Controller, Get, Delete, Patch, Param, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/posts')
export class AdminPostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    async getAllPosts() {
        return this.postsService.getAllPosts(); // Lấy tất cả bài viết
    }

    // @Delete(':id')
    // async deletePost(@Param('id') id: string) {
    //     return this.postsService.deletePost(id); // Xóa bài viết bất kỳ
    // }

    // @Patch(':id/flag')
    // async flagPost(@Param('id') id: string) {
    //     return this.postsService.flagPost(id); // Gắn nhãn vi phạm
    // }
}
