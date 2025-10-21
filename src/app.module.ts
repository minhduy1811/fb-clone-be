import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FirebaseService } from './firebase/firebase.service';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AdminModule } from './admin/admin.module';
import { FirebaseSessionMiddleware } from './middlewares/firebase-session.middleware';


@Module({
  imports: [AuthModule, PostsModule, AdminModule, CommentsModule],
  providers: [FirebaseService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseSessionMiddleware)
      .forRoutes('posts', 'admin');
  }
}
