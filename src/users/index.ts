import express from "express";

import UserModel from "./schema.js";
import { CookieCheckMiddleWare } from "../authorization/cookieCheck.js";

const router = express.Router();

router.get("/", CookieCheckMiddleWare, async (req, res, next) => {
  try {
    // console.log(req.cookies.accessToken);
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", CookieCheckMiddleWare, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.send(user);
  } catch (error) {}
});

export default router;
