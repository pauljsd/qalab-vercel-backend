import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.schema';
import { randomBytes } from 'crypto';
import { LoginLog } from './login-log.schema';
import { MailerService } from './mailer.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(LoginLog.name) private loginLogModel: Model<LoginLog>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signup(dto: SignUpDto) {
    const { fullName, email, password, confirmPassword } = dto;

    if (password !== confirmPassword)
      throw new BadRequestException('Passwords do not match.');

    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('Email already exists.');

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');

    const user = new this.userModel({
      fullName,
      email,
      password: hashed,
      isVerified: false,
      verificationToken,
    });

    await user.save();

    await this.mailerService.sendVerificationEmail(email, verificationToken);

    // 🚀 You can send verification email here
    console.log(
      `Verification link: http://localhost:3000/auth/verify/${verificationToken}`,
    );

    return {
      message:
        'Account created successfully! Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({ verificationToken: token });

    if (!user)
      throw new BadRequestException('Invalid or expired verification token.');

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return { message: 'Email verified successfully! You can now log in.' };
  }

  async login(dto: LoginDto, req?: any) {
    const { email, password } = dto;
    const ipAddress = req?.ip || 'Unknown';
    const userAgent = req?.headers?.['user-agent'] || 'Unknown';

    const user = await this.userModel.findOne({ email });
    if (!user) {
      // ❌ Log failed login attempt (no user found)
      await this.loginLogModel.create({
        userEmail: email,
        loginAt: new Date(),
        ipAddress,
        userAgent,
        success: false,
      });
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.isVerified) {
      // ❌ Log failed login attempt (email not verified)
      await this.loginLogModel.create({
        user: user._id,
        userEmail: user.email,
        loginAt: new Date(),
        ipAddress,
        userAgent,
        success: false,
      });
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // ❌ Log failed login attempt (wrong password)
      await this.loginLogModel.create({
        user: user._id,
        userEmail: user.email,
        loginAt: new Date(),
        ipAddress,
        userAgent,
        success: false,
      });
      throw new UnauthorizedException('Invalid credentials.');
    }

    // ✅ Log successful login
    await this.loginLogModel.create({
      user: user._id,
      userEmail: user.email,
      loginAt: new Date(),
      ipAddress,
      userAgent,
      success: true,
    });

    // 🧠 Create JWT payload
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token,
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }

  async getLoginLogs() {
    return this.loginLogModel
      .find()
      .populate('user', 'fullName email')
      .sort({ loginAt: -1 })
      .exec();
  }

  async deleteLoginLog(logId: string) {
    const deleted = await this.loginLogModel.findByIdAndDelete(logId);
    if (!deleted) {
      throw new BadRequestException('Login log not found.');
    }
    return { message: 'Login log deleted successfully.' };
  }

  // 🧹 Delete all login logs (use with caution)
  async deleteAllLoginLogs() {
    await this.loginLogModel.deleteMany({});
    return { message: 'All login logs deleted successfully.' };
  }

  // 🧍 Delete all logs for a specific user
  async deleteUserLoginLogs(userId: string) {
    const result = await this.loginLogModel.deleteMany({ user: userId });
    return {
      message: `Deleted ${result.deletedCount} login logs for this user.`,
    };
  }

  async getAllUsers() {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  async logout(userId: string) {
    // Optional: Track logout time or invalidate refresh tokens if implemented
    await this.loginLogModel.create({
      user: userId,
      loginAt: new Date(),
      success: true,
      userEmail: 'N/A',
      ipAddress: 'N/A',
      userAgent: 'Logout',
    });

    return { message: 'User logged out successfully.' };
  }
}
