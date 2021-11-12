import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { LoginData, User, UserWithStatics } from "../types/user";

const { Schema, model } = mongoose;

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  role: { type: String, default: "Guest", enum: ["Host", "Guest"] },
  refreshToken: { type: String },
  googleId: { type: String }
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject._v;
  delete userObject.refreshToken;
  return userObject;
};

UserSchema.statics.checkValidity = async function (loginData: LoginData) {
  const { email, password } = loginData;
  const user = await this.findOne({ email });
  if (user) {
    const isPasswordCorret = await bcrypt.compare(password, user.password);
    if (isPasswordCorret) return user;
    else return false;
  } else return false;
};

export default model<User, UserWithStatics>("User", UserSchema);
