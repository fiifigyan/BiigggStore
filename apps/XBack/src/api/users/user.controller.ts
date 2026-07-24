import { Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../../middleware/auth';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getProfile(req.userId!);
      res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.updateProfile(req.userId!, req.body);
      res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  getAddresses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const addresses = await this.userService.getAddresses(req.userId!);
      res.json({ success: true, addresses });
    } catch (error) {
      next(error);
    }
  };

  addAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const address = await this.userService.addAddress(req.userId!, req.body);
      res.status(201).json({ success: true, address });
    } catch (error) {
      next(error);
    }
  };

  updateAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const address = await this.userService.updateAddress(req.userId!, id, req.body);
      res.json({ success: true, address });
    } catch (error) {
      next(error);
    }
  };

  deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.userService.deleteAddress(req.userId!, id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}