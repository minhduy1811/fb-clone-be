// src/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // 🧾 Route đăng ký (chỉ cho người đã xásc thực qua Firebase)
    @Post('signup')
    @UseGuards(FirebaseAuthGuard)
    async signup(@Req() req, @Body() body: CreateUserDto) {
        const uid = req.user.uid;
        return this.authService.registerUser(uid, body);
    };
    @Get('me')
    async getMe(@Req() req) {
        const uid = req.user.uid;
        return this.authService.getUser(uid);
    }

}
