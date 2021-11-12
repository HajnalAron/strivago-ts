import express from "express";
import UserModel from "../users/schema.js";
import { generateTokens, verifyAndRegenerateTokens } from "./jwt.js";
import passport from "passport";
import { CookieCheckMiddleWare } from "./cookieCheck.js";
import { isProduction } from "../server.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const newUser = await new UserModel(req.body).save();
    console.log(process.env.API_URL);
    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await UserModel.checkValidity(req.body);
    if (user) {
      const { accessToken, refreshToken } = await generateTokens(user);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none"
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none"
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/refreshToken", async (req, res, next) => {
  try {
    const { currentRefreshToken } = req.body;
    const { accessToken, refreshToken } = await verifyAndRegenerateTokens(
      currentRefreshToken
    );
    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new Error("Missing user data");
      } else
        res.cookie("accessToken", req.user.tokens.accessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "none"
        });
      res.cookie("refreshToken", req.user.tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none"
      });
      res.redirect(`http://localhost:3001`);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/logout", CookieCheckMiddleWare, async (req: any, res, next) => {
  try {
    if (!req.user) {
      throw new Error("Missing user data");
    } else req.user.refreshToken = null;
    await req.user.save();
    res.send("Successfuly logged out");
  } catch (error) {
    next(error);
  }
});

export default router;
