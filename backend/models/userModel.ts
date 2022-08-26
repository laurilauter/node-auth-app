import mongoose, { Schema, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";
const emailSecretKey = process.env.EMAIL_SECRET_KEY;

//1.data
//2. documents
//3. models

//interface
export interface IUser {
  email: string;
  password: string;
  verified: boolean;
}
//called on document
interface IUserDocument extends IUser, Document {
  generateVerificationToken: () => Promise<this>;
}

//called on model
interface IUserModel extends Model<IUserDocument> {
  generateVerificationToken: (_id: string) => Promise<IUserDocument>;
}

//schema
const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

UserSchema.methods.generateVerificationToken = function (this: IUserDocument) {
  const user = this;
  const verificationToken = jwt.sign({ id: user._id }, emailSecretKey!, {
    expiresIn: "7d",
  });
  return verificationToken;
};

//model
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
