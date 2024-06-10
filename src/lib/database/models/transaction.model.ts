import { Schema, model, models, Document } from "mongoose";
import { IUser } from "./user.model";

export interface ITransaction extends Document {
  createdAt: Date;
  stripeId: string;
  amount: number;
  plan: string;
  credits: number;
  buyer: Schema.Types.ObjectId | IUser;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  credits: {
    type: Number,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Transaction =
  models?.Transaction || model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
