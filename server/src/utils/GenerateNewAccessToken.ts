import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import { User } from "../models/userModel";
import { ApiErrorResponse } from "./ApiErrorResponse";

export async function generateNewAccessToken(refreshToken: string) {
  const refreshDecdedToken = jwt.verify(
    refreshToken,
    config.REFRESH_TOKEN_SECRET
  ) as JwtPayload;

  const user = await User.findOne({ email: refreshDecdedToken.email });

  if (!user) {
    throw new ApiErrorResponse(401, "Invalid Refresh Token");
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return { refreshDecdedToken, newAccessToken, newRefreshToken };
}
