import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { ProForgeService } from './proForge.service';
import { ProForgeController } from './proForge.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [ProForgeController],
  providers: [ProForgeService],
})
export class ProForgeModule {}
