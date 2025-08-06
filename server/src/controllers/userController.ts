import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { z, ZodError } from "zod";
import { ApiErrorResponse } from "../utils/ApiErrorResponse";
import { User } from "../models/userModel";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/cookiesOption";

const createUserBodySchema = z.object({
  username: z
    .string()
    .refine((name) => !name.includes(" "), "No spaces allowed")
    .min(4, "Username should be atleast 4 characters long.")
    .max(16, "Username should not be more then 16 characters."),
  email: z.email(),
  password: z.string(),
});

async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedBody = createUserBodySchema.parse(req.body);

    const exisitngUser = await User.findOne({ email: parsedBody.email });
    if (exisitngUser) {
      throw new ApiErrorResponse(409, "User already exist with this email");
    }

    const newUser = await User.create(parsedBody);

    if (!newUser) {
      throw new ApiErrorResponse(500, "Failed to create new User");
    }

    res.status(201).json(new ApiResponse(201, "User created", newUser));
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err) => err.message);
      throw new ApiErrorResponse(
        400,
        "Invalid request body for creating user",
        errors
      );
    }
    next(error);
  }
}

const loginUserBodySchema = z.object({
  username: z
    .string()
    .refine((name) => !name.includes(" "), "No spaces allowed")
    .min(4, "Username should be atleast 4 characters long.")
    .max(16, "Username should not be more then 16 characters."),
  password: z.string(),
});

async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedBody = loginUserBodySchema.parse(req.body);
    const user = await User.findOne({ username: parsedBody.username });

    if (!user) {
      throw new ApiErrorResponse(401, "User not found, Invalid credentials");
    }

    const isPasswordValid = await user.isPasswordCorrect(parsedBody.password);

    if (!isPasswordValid) {
      throw new ApiErrorResponse(401, "Invalid user credentials");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .json(
        new ApiResponse(200, "User logged in!", {
          _id: user._id,
          username: user.username,
          email: user.email,
        })
      );
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err) => err.message);
      throw new ApiErrorResponse(
        400,
        "Invalid request body for loging in user",
        errors
      );
    }
    next(error);
  }
}

export { createUser, loginUser };
