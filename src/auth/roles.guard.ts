// src/auth/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true; // không cần role đặc biệt
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user?.uid) {
            throw new ForbiddenException('Không tìm thấy thông tin người dùng');
        }

        const dbUser = await this.authService.getUser(user.uid);
        if (!dbUser?.role || !requiredRoles.includes(dbUser.role)) {
            throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
        }

        return true;
    }
}
