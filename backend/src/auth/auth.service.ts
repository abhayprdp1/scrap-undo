import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SendOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { phone: dto.phone },
      });
    }

    // Invalidate previous OTPs
    await this.prisma.otp.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    await this.prisma.otp.create({
      data: {
        userId: user.id,
        phone: dto.phone,
        code,
        expiresAt,
      },
    });

    // In dev, log OTP instead of sending SMS
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📱 OTP for ${dto.phone}: ${code}`);
    } else {
      // TODO: Send via Twilio
      // await this.twilioClient.messages.create({...})
    }

    return {
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV !== 'production' && { devOtp: code }),
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const otp = await this.prisma.otp.findFirst({
      where: {
        userId: user.id,
        code: dto.code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new UnauthorizedException('Invalid or expired OTP');

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { used: true },
    });

    // Update role/name if provided (registration)
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...(dto.role && { role: dto.role }),
        ...(dto.name && { name: dto.name }),
      },
      include: { dealer: true },
    });

    const token = this.jwt.sign(
      { sub: updatedUser.id, phone: updatedUser.phone },
      {
        secret: this.config.get('JWT_SECRET') || 'fallback_secret',
        expiresIn: this.config.get('JWT_EXPIRES_IN') || '7d',
      },
    );

    return { access_token: token, user: updatedUser };
  }
}
