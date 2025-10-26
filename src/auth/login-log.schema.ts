import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class LoginLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  user?: Types.ObjectId;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ default: Date.now })
  loginAt: Date;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop({ default: true })
  success: boolean;
}

export const LoginLogSchema = SchemaFactory.createForClass(LoginLog);
