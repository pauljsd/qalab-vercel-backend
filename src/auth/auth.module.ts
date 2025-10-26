import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginLog, LoginLogSchema } from './login-log.schema';
import { User, UserSchema } from '../user/user.schema';
import { UserModule } from '../user/user.module';
import { MailerService } from './mailer.service';
// import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: LoginLog.name, schema: LoginLogSchema },
    ]),
    JwtModule.register({
      secret: 'super-secret-key', // ideally use process.env.JWT_SECRET
      signOptions: { expiresIn: '30m' },
    }),
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.gmail.com',
    //     auth: {
    //       user: 'learnwithqalab@gmail.com',
    //       pass: 'Change1password#',
    //     },
    //   },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailerService],
})
export class AuthModule {}
