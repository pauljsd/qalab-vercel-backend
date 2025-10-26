import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can also use 'Outlook', 'Yahoo', or custom SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('📧 Email:', process.env.EMAIL_USER);
    console.log('🔑 Password loaded:', !!process.env.EMAIL_PASS);
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationLink = `http://localhost:3000/auth/verify/${token}`; // update for production

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email Address',
      html: `
        <h2>Welcome!</h2>
        <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <br/><br/>
        <p>If you didn’t request this, you can safely ignore it.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
  }
}
