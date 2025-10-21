// src/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseSessionGuard } from '../common/guards/firebase-session.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('signup')
    async signup(@Body() body: CreateUserDto) {
        return this.authService.signupWithIdToken(body.idToken, body);
    }
    @Post('login')
    async login(
        @Body('idToken') idToken: string,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.createSession(idToken, res);
    }
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }

}
