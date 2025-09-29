import { Response } from "express";
import { AuthConfig } from "../config/authConfig";
import { timeStringToMs } from "../utils/timeString";

export const setTokens = (res: Response, accessToken: string, refreshToken?: string) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: timeStringToMs(AuthConfig.accessTokenExpiresIn), // 1 day
  });

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: timeStringToMs(AuthConfig.refreshTokenExpiresIn), // 7 days
    });
  }
};
