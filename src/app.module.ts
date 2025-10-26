import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProForgeModule } from './proforge/proForge.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes .env available everywhere
    }),
    // ⚙️ MongoDB connection (replace the connection string with yours)
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_URL as string),

    // 🧩 Feature modules
    UserModule,
    AuthModule,
    ProForgeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
