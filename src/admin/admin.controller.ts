import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@Roles('admin')
@UseGuards(FirebaseAuthGuard, RolesGuard)
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
