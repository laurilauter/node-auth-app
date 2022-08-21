import { model, Schema } from "mongoose";

//interface
export interface IUser {
  email: string;
  password: string;
  isVerified: boolean;
}
//schema
const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, required: true, default: false },
});
//model
export const User = model<IUser>("User", UserSchema);
