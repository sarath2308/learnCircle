import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || "access-secret";

export interface IToken {
  signAccessToken(payload: object, expiresIn?: string): string;
  generateRefreshToken(payload: any): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): JwtPayload | null;
}

export class tokenService implements IToken {
  signAccessToken(payload: object, expiresIn: string | number = "15m"): string {
    const options = { expiresIn } as unknown as SignOptions;
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
  }

  generateRefreshToken(payload: any) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
