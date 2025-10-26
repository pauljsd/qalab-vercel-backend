import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 🧾 Transaction Subdocument
@Schema({ _id: false })
export class Transaction {
  @Prop({ type: String, enum: ['credit', 'debit'], required: true })
  type: 'credit' | 'debit';

  @Prop({ type: Number, required: true, default: 0 })
  amount: number;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Date, default: Date.now })
  date?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// 🧑‍💼 Main User Schema
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, default: null })
  verificationToken: string | null;

  @Prop({ type: String, enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop({ type: [String], default: [] })
  entitlements: string[];

  // 🏦 Banking Fields
  @Prop({ type: String, unique: true, sparse: true })
  accountNumber?: string;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop({ type: [TransactionSchema], default: [] })
  transactions: Transaction[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
