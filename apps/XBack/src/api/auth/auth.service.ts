import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken, generateRefreshToken, generateResetToken, verifyResetToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { prisma } from '../../lib/prisma';
import { Resend } from 'resend';

const buildResetEmailHtml = (resetUrl: string, firstName?: string) => `
  <html>
    <body style="font-family: Arial, sans-serif; margin:0; padding:0; background:#f5f7fb;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:24px;">
            <table width="100%" style="max-width:600px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 18px 50px rgba(0,0,0,0.08);" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="padding:32px; background:#0f2d6e; color:#ffffff; text-align:center;">
                  <h1 style="margin:0; font-size:28px; line-height:1.2;">Reset your XStore password</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:32px; color:#17233d;">
                  <p style="margin:0 0 16px; font-size:16px; line-height:1.7;">Hi ${firstName || 'there'},</p>
                  <p style="margin:0 0 24px; font-size:16px; line-height:1.7;">We received a request to reset your password for XStore. Tap the button below to choose a new password.</p>
                  <p style="text-align:center; margin:0 0 32px;"><a href="${resetUrl}" style="background:#0f2d6e; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:10px; display:inline-block; font-size:16px;">Reset password</a></p>
                  <p style="margin:0 0 24px; font-size:15px; line-height:1.7; color:#4e5870;">This link will expire in 1 hour. If you didn't request a reset, you can safely ignore this email.</p>
                  <p style="margin:0; font-size:14px; line-height:1.7; color:#718096;">If the button doesn't work, copy and paste this link into your browser:</p>
                  <p style="margin:12px 0 0; font-size:14px; line-height:1.6; word-break:break-all;"><a href="${resetUrl}" style="color:#0f2d6e; text-decoration:none;">${resetUrl}</a></p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px; background:#f0f4ff; color:#556080; font-size:13px; text-align:center;">
                  <p style="margin:0;">Need help? Reply to this email or contact support through the app.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

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

    // Build a reset URL for the user (frontend should handle the route)
    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:19006';
    const resetUrl = `${frontendBase.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

    const from = process.env.FROM_EMAIL;
    const subject = 'Reset your XStore password';
    const html = buildResetEmailHtml(resetUrl, user.firstName || undefined);

    if (!process.env.RESEND_API_KEY) {
      console.error('Password reset email not sent: RESEND_API_KEY is not configured.');
    } else if (!from) {
      console.error('Password reset email not sent: FROM_EMAIL is not configured.');
    } else {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({ from, to: user.email, subject, html });
        console.log('Password reset email delivered by Resend.');
      } catch (sendError) {
        console.error('Resend password reset email failed.', sendError);
      }
    }

    // Return token only in non-production environments for debugging/testing
    if (process.env.NODE_ENV !== 'production') {
      return {
        message: 'Password reset link generated successfully.',
        resetToken,
      };
    }

    return {
      message: 'Password reset link generated successfully.',
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