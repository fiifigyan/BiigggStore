import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken, generateRefreshToken, generateResetToken, verifyResetToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { prisma } from '../../lib/prisma';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    });

    await prisma.cart.create({
      data: { userId: user.id },
    });

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
      access_token: token,
      refresh_token: refreshToken,
      customer: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
      access_token: token,
      refresh_token: refreshToken,
      customer: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
      },
    };
  }

  async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        createdAt: true,
        addresses: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async refreshToken(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      access_token: generateToken(user.id),
      refresh_token: generateRefreshToken(user.id),
    };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: 'If an account with that email exists, a password reset link has been generated.',
      };
    }

    const resetToken = generateResetToken(user.id);

    return {
      message: 'Password reset link generated successfully.',
      resetToken,
    };
  }

  async resetPassword(token: string, password: string) {
    const decoded = verifyResetToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return {
      message: 'Password reset successfully.',
    };
  }
}