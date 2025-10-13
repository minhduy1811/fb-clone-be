import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { FirebaseAuthGuard } from "src/auth/firebase-auth.guard";

@Controller('posts/:postId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @UseGuards(FirebaseAuthGuard)
    @Post()
    addComment(@Param('postId') postId: string, @Body() body: any) {
        return this.commentsService.addComment(postId, body);
    }

    @Get()
    getComments(@Param('postId') postId: string) {
        return this.commentsService.getComments(postId);
    }

    @Patch(':commentId')
    updateComment(
        @Param('postId') postId: string,
        @Param('commentId') commentId: string,
        @Body('content') content: string
    ) {
        return this.commentsService.updateComment(postId, commentId, content);
    }

    @Delete(':commentId')
    deleteComment(
        @Param('postId') postId: string,
        @Param('commentId') commentId: string
    ) {
        return this.commentsService.deleteComment(postId, commentId);
    }
}
