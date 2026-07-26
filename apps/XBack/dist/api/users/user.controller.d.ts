import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class UserController {
    private userService;
    constructor();
    getProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getAddresses: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    addAddress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateAddress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteAddress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map