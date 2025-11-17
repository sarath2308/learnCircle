import dotenv from "dotenv";
dotenv.config();

export const AuthConfig = {
  accessTokenSecret: String(process.env.ACCESS_TOKEN_SECRET || "access-secret"),
  accessTokenExpiresIn: String(process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"),
  refreshTokenSecret: String(process.env.REFRESH_TOKEN_SECRET || "refresh-secret"),
  refreshTokenExpiresIn: String(process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"),
};
