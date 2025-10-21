import { Injectable, NestMiddleware } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FirebaseSessionMiddleware implements NestMiddleware {
    constructor(private firebaseService: FirebaseService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const sessionCookie = req.cookies?.session;

        if (!sessionCookie) {
            return res.status(401).json({ message: 'Missing session cookie' });
        }

        try {
            const decoded = await this.firebaseService.verifySessionCookie(sessionCookie);
            (req as any).user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid session cookie' });
        }
    }
}
