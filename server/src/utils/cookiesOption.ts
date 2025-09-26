import { CookieOptions } from "express";
import config from "../config/config";

const baseOptions: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "prod",
  sameSite: config.NODE_ENV === "prod" ? "none" : "lax",
};

export const accessTokenOptions: CookieOptions = {
  ...baseOptions,
  maxAge: 1000 * 60 * 15, // 15 minutes
};

export const refreshTokenOptions: CookieOptions = {
  ...baseOptions,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};
