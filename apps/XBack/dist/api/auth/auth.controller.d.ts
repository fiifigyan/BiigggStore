import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class AuthController {
    private authService;
    constructor();
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMe: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    refreshToken: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    socialLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    forgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map