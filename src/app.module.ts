import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FirebaseService } from './firebase/firebase.service';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, PostsModule, CommentsModule, AdminModule],
  providers: [FirebaseService],
})
export class AppModule { }
