import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema'; // renamed from user.entity.ts
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  // 🧩 Add entitlement to user
  async grantAccess(userId: string, module: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user.entitlements.includes(module)) {
      user.entitlements.push(module);
      await user.save();
    }
    return user;
  }

  // 🧩 Fetch all entitlements for a user
  async getUserEntitlements(userId: string): Promise<string[]> {
    const user = await this.findById(userId);
    return user.entitlements;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findByVerificationToken(token: string) {
    return this.userModel.findOne({ verificationToken: token }).exec();
  }

  async createUser(data: Partial<User>) {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async verifyUser(userId: string) {
    await this.userModel.updateOne(
      { _id: userId },
      { isVerified: true, verificationToken: null },
    );
  }

  async findAll(): Promise<any[]> {
    const users = await this.userModel
      .find()
      .select('fullName email createdAt')
      .exec();

    return users.map((user) => ({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      dateJoined: user.createdAt,
    }));
  }
  async deleteUser(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    return deleted;
  }
  async countUsers(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
