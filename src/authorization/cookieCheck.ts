import createHttpError from "http-errors";
import UserModel from "../users/schema.js";
import { verifyAccesToken } from "./jwt.js";
import { RequestHandler } from "express";
import { User } from "../types/user.js";

export const CookieCheckMiddleWare: RequestHandler = async (req, res, next) => {
  try {
    if (!req.cookies.accessToken) {
      next(createHttpError(401, "Please provide access token in cookies"));
    } else {
      const decodedToken: any = await verifyAccesToken(req.cookies.accessToken);
      const user: any = await UserModel.findById(decodedToken._id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(createHttpError(404, "User not found"));
      }
    }
  } catch (error) {
    next(createHttpError(401, "Invalid access token"));
  }
};
