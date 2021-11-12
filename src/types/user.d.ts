import { Request } from "express";
import { Model } from "mongoose";

export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: "Host" | "Guest";
  refreshToken?: string | null;
  googleId?: string;
  save();
}

export interface AuthPayload {
  _id: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserWithStatics extends Model<User> {
  checkValidity(LoginData: LoginData): promise;
}

declare global {
  namespace Express {
    interface User {
      tokens: {
        refreshToken: string;
        accessToken: string;
      };
    }
  }
}

export type Token = string;
