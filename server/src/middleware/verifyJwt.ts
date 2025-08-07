import { ApiErrorResponse } from "../utils/ApiErrorResponse";
import { User } from "./../models/userModel";
import config from "../config/config";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/cookiesOption";
import { generateNewAccessToken } from "../utils/generateNewAccessToken";
import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt, { TokenExpiredError } from "jsonwebtoken";

export async function verifyJwt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!accessToken) {
    throw new ApiErrorResponse(
      401,
      "Unauthorized request AccessToken not found"
    );
  }

  let decodedToken: JwtPayload;
  try {
    decodedToken = jwt.verify(
      accessToken,
      config.ACCESS_TOKEN_SECRET
    ) as JwtPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new ApiErrorResponse(401, "Refresh Token not found");
      }

      try {
        const {
          refreshDecdedToken: newUser,
          newAccessToken,
          newRefreshToken,
        } = await generateNewAccessToken(refreshToken);

        req.user = newUser;

        res.cookie("accessToken", newAccessToken, accessTokenOptions);
        res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

        return next();
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        throw new ApiErrorResponse(401, "Invalid or Expired Refresh Token");
      }
    }

    throw new ApiErrorResponse(401, "Invalid Access Token");
  }

  const user = await User.findOne({
    email: decodedToken.email,
  });

  if (!user) {
    throw new ApiErrorResponse(401, "Invalid Access Token");
  }

  req.user = decodedToken;
  next();
}
