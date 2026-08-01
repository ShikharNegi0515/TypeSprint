import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetOtp(email: string, otp: string): Promise<void> {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpSecure = this.configService.get<string>('SMTP_SECURE') === 'true';
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const smtpFrom = this.configService.get<string>('SMTP_FROM');

    this.logger.log(
      `[SMTP] Resolved config — host: ${smtpHost}, port: ${smtpPort}, secure: ${smtpSecure}, user: ${smtpUser}, from: ${smtpFrom}, pass set: ${!!smtpPass}`,
    );

    if (!smtpHost || !smtpUser || !smtpPass) {
      this.logger.warn(
        `[SMTP] Missing required env vars — SMTP_HOST: ${smtpHost}, SMTP_USER: ${smtpUser}, SMTP_PASS set: ${!!smtpPass}. OTP for ${email}: ${otp}`,
      );
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Verify SMTP connection before attempting to send
    try {
      await transporter.verify();
      this.logger.log('[SMTP] Connection verified successfully');
    } catch (verifyErr) {
      this.logger.error('[SMTP] Connection verify FAILED:', verifyErr);
      throw verifyErr;
    }

    const from = smtpFrom || `"TypeSprint" <${smtpUser}>`;

    try {
      const info = await transporter.sendMail({
        from,
        to: email,
        subject: 'Your TypeSprint password reset code',
        text: `Your password reset code is: ${otp}\n\nThis code expires in 10 minutes. If you did not request this, you can ignore this email.`,
        html: `
          <div style="font-family: monospace, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="margin-bottom: 8px;">Password reset</h2>
            <p style="color: #666;">Use this code to reset your TypeSprint password:</p>
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0;">${otp}</p>
            <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
          </div>
        `,
      });
      this.logger.log(`[SMTP] Email sent — messageId: ${info.messageId}`);
    } catch (sendErr) {
      this.logger.error(`[SMTP] sendMail FAILED for ${email}:`, sendErr);
      throw sendErr;
    }
  }
}
