import { Request, Response, NextFunction } from "express";
import { ApiErrorResponse } from "../utils/ApiErrorResponse";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { User } from "./../models/userModel";
import config from "../config/config";
import { generateNewAccessToken } from "../utils/GenerateNewAccessToken";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/cookiesOption";

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

  let decodedToken;
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
