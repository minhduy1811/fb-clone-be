import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthService } from '../auth/auth.service';
import { FirebaseService } from '../firebase/firebase.service';
import { AdminService } from './admin.service';

@Module({
    controllers: [AdminController],
    providers: [AuthService, FirebaseService, AdminService],
})
export class AdminModule { }
