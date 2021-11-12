import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import userRouter from "./users/index.js";
import accommadationRouter from "./accommodation/index.js";
import authorizationRouter from "./authorization/index.js";
import googleStrategy from "./authorization/oauth.js";
import passport from "passport";
import cookieParser from "cookie-parser";

const server = express();
const PORT = process.env.PORT || 3000;

passport.use("google", googleStrategy);

server.use(passport.initialize());
server.use(cors());
server.use(express.json());
server.use(cookieParser());
server.use("/users", userRouter);
server.use("/accommadation", accommadationRouter);
server.use("/", authorizationRouter);

console.log(listEndpoints(server));

export const isProduction =
  process.env.NODE_ENV === "production" ? true : false;

if (!process.env.MONGO_CONNECTION) {
  throw new Error("Missing mongo connection string");
} else mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  server.listen(PORT, () => {
    console.log("Mongo has been connected");
    console.log("Server running on port " + PORT);
  });
});
server.on("error", (error) => {
  console.log(error);
});
