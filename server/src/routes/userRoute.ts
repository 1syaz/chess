import { Request, Response } from "express";
import { Router } from "express";
import {
  createUser,
  handleGoogleLogin,
  loginUser,
} from "../controllers/userController";
import { AsyncHandler } from "../utils/AsyncHandler";
import passport from "passport";
import { verifyJwt } from "../middleware/verifyJwt";

const userRouter = Router();

userRouter.post("/", AsyncHandler(createUser));

userRouter.post("/test", verifyJwt, (req: Request, res: Response) => {
  console.log(req.user);
  return res.status(200).json("working");
});

userRouter.get("/auth/google", passport.authenticate("google"));
userRouter.post("/login", AsyncHandler(loginUser));

userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login?error=oauth_failed",
  }),
  AsyncHandler(handleGoogleLogin)
);

export default userRouter;
