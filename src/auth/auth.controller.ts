// src/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseSessionGuard } from '../common/guards/firebase-session.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // 🧾 Route đăng ký (chỉ cho người đã xásc thực qua Firebase)
    @Post('signup')
    async signup(@Body() body: CreateUserDto) {
        return this.authService.signupWithIdToken(body.idToken, body);
    }

    @Get('me')
    @UseGuards(FirebaseSessionGuard)
    async getMe(@Req() req) {
        const uid = (req as any).user.uid;
        return this.authService.getUser(uid);
    }
    @Post('login')
    async login(
        @Body('idToken') idToken: string,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.createSession(idToken, res);
    }

    // 🚪 Đăng xuất (xoá cookie)
    @Post('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('session');
        return res.json({ message: 'Logged out' });
    }
}
