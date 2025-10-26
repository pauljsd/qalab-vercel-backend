import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';

@Injectable()
export class ProForgeService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private generateAccountNumber(): string {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  }

  async createAccount(email: string, fullName: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (user.accountNumber)
      throw new BadRequestException(
        'User already has an account. Please use the login option.',
      );

    user.accountNumber = this.generateAccountNumber();
    user.balance = 20000;
    user.fullName = fullName;

    await user.save();
    return user;
  }

  async login(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new NotFoundException(
        'User not found. Please create an account first.',
      );

    if (!user.accountNumber)
      throw new BadRequestException(
        'Account not yet created. Please use the create account option.',
      );

    return user;
  }
}
