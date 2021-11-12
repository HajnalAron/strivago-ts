import createHttpError from "http-errors";
import JWT from "jsonwebtoken";
import { AuthPayload, Token, User } from "../types/user.js";
import UserModel from "../users/schema.js";

const generateAccessToken = (payload: AuthPayload) =>
  new Promise((resolve, reject) => {
    if (!process.env.encryptionKey) {
      throw new Error("Missing encryption key");
    } else
      JWT.sign(
        payload,
        process.env.encryptionKey,
        { expiresIn: "15m" },
        (error, token) => {
          if (error) reject(error);
          else resolve(token);
        }
      );
  });

const generateRefreshToken = (payload: AuthPayload) =>
  new Promise((resolve, reject) => {
    if (!process.env.encryptionKey) {
      throw new Error("Missing encryption key");
    } else
      JWT.sign(
        payload,
        process.env.encryptionKey,
        { expiresIn: "7 days" },
        (error, token) => {
          if (error) reject(error);
          else resolve(token);
        }
      );
  });

export const generateTokens = async (user: User) => {
  const accessToken: any = await generateAccessToken({ _id: user._id });
  const refreshToken: any = await generateRefreshToken({ _id: user._id });
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const verifyAccesToken = (token: Token) =>
  new Promise((res, rej) => {
    if (!process.env.encryptionKey) {
      throw new Error("Missing encryption key");
    } else
      JWT.verify(token, process.env.encryptionKey, (error, decodedToken) => {
        if (error) rej(error);
        else res(decodedToken);
      });
  });

export const verifyRefreshToken = (token: Token) =>
  new Promise((res, rej) => {
    if (!process.env.encryptionKey) {
      throw new Error("Missing encryption key");
    }
    JWT.verify(token, process.env.encryptionKey, (error, decodedToken) => {
      if (error) rej(error);
      else res(decodedToken);
    });
  });

export const verifyAndRegenerateTokens = async (refreshToken: Token) => {
  const decodedRefreshToken: any = await verifyRefreshToken(refreshToken);

  const user = await UserModel.findById(decodedRefreshToken._id);

  if (!user) throw createHttpError(404, "User not found");

  if (user.refreshToken && user.refreshToken === refreshToken) {
    const { accessToken, refreshToken } = await generateTokens(user);

    return { accessToken, refreshToken };
  } else throw createHttpError(401, "Refresh token not valid!");
};
