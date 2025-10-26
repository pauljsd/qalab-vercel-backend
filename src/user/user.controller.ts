import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ Get entitlements for logged-in user
  // @UseGuards(JwtAuthGuard)
  // @Get('entitlements')
  // async getEntitlements(@Req() req) {
  //   const entitlements = await this.userService.getUserEntitlements(req.user.userId);
  //   return { entitlements };
  // }

  // ✅ Grant access (admin/payment trigger)
  // @UseGuards(JwtAuthGuard)
  // @Patch('grant/:module')
  // async grantAccess(@Param('module') module: string, @Req() req) {
  //   const updatedUser = await this.userService.grantAccess(req.user.userId, module);
  //   return { message: `Access granted to ${module}`, entitlements: updatedUser.entitlements };
  // }

  @Get()
  async getAllUsers(): Promise<User[]> {
    const users = this.userService.findAll();
    return users;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
