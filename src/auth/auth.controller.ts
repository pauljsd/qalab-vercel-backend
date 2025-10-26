import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Req,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('test')
  testAuth() {
    return { message: 'Auth controller is working 🚀' };
  }

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Get('verify/:token')
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Req() req) {
    return this.authService.login(dto, req);
  }

  // ✅ Logout endpoint
  @Post('logout')
  logout(@Req() req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return { message: 'No token provided.' };
    }
    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }

  // @UseGuards(RolesGuard)
  // @Roles('admin')
  // @Get('login-activities')
  @Get('login-activities')
  async getLoginLogs() {
    return this.authService.getLoginLogs();
  }

  // ✅ Get all registered users
  // @UseGuards(RolesGuard)
  // @Roles('admin')
  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    const result = await this.userService.deleteUser(id);
    if (!result) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }

  @Get('users/count')
  async getUserCount() {
    const count = await this.userService.countUsers();
    return { count };
  }

  // 🗑️ Delete a specific login log
  @Delete('logs/:id')
  async deleteLog(@Param('id') id: string) {
    return this.authService.deleteLoginLog(id);
  }

  @Delete('logs')
  async deleteAllLogs() {
    return this.authService.deleteAllLoginLogs();
  }

  @Delete('logs/user/:userId')
  async deleteUserLogs(@Param('userId') userId: string) {
    return this.authService.deleteUserLoginLogs(userId);
  }
}
