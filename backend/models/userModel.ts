import { model, Schema } from "mongoose";

//interface
export interface IUser {
  email: string;
  password: string;
}
//schema
const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//model
export const User = model<IUser>("User", UserSchema);
