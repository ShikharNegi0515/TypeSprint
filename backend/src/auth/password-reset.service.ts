import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PasswordResetOtp } from './entities/password-reset-otp.entity';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_REQUESTS_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 5;

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetOtp)
    private readonly otpRepository: Repository<PasswordResetOtp>,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async requestOtp(email: string): Promise<{ message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail);

    const genericMessage =
      'If an account exists with this email, a verification code has been sent.';

    if (!user) {
      return { message: genericMessage };
    }

    if (!user.password) {
      throw new BadRequestException(
        'This account uses Google sign-in. Please log in with Google instead.',
      );
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await this.otpRepository.count({
      where: {
        email: normalizedEmail,
        createdAt: MoreThan(oneHourAgo),
      },
    });

    if (recentCount >= MAX_OTP_REQUESTS_PER_HOUR) {
      throw new BadRequestException(
        'Too many reset attempts. Please try again in an hour.',
      );
    }

    await this.otpRepository.update(
      { email: normalizedEmail, used: false },
      { used: true },
    );

    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await this.otpRepository.save({
      email: normalizedEmail,
      otpHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
      attempts: 0,
      used: false,
    });

    await this.mailService.sendPasswordResetOtp(normalizedEmail, otp);

    return { message: genericMessage };
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const record = await this.otpRepository.findOne({
      where: { email: normalizedEmail, used: false },
      order: { createdAt: 'DESC' },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    if (record.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Verification code has expired');
    }

    if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
      throw new UnauthorizedException(
        'Too many failed attempts. Please request a new code.',
      );
    }

    const otpValid = await bcrypt.compare(otp, record.otpHash);
    if (!otpValid) {
      await this.otpRepository.update(record.id, {
        attempts: record.attempts + 1,
      });
      throw new UnauthorizedException('Invalid verification code');
    }

    await this.usersService.resetPassword(normalizedEmail, newPassword);

    await this.otpRepository.update(record.id, { used: true });

    return { message: 'Password reset successfully. You can now log in.' };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
