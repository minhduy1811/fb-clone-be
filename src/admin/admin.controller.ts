import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';
import { FirebaseSessionGuard } from 'src/common/guards/firebase-session.guard';

@Controller('admin')
@Roles('admin')
@UseGuards(RolesGuard, FirebaseSessionGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }
    @Get('users')
    async getAllUsers(@Req() req) {
        return this.adminService.getAllUsers();
    }

    @Get('check')
    async checkAdmin() {
        return { valid: true, role: 'admin' };
    }
}
