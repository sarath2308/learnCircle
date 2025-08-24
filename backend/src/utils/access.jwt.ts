import jwt, { JwtPayload, SignOptions} from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || "access-secret";

export interface IAccessToken {
  signAccessToken(payload: object, expiresIn?: string): string;
  verifyAccessToken(token: string): JwtPayload | null;
}

export class AccessToken implements IAccessToken {
  signAccessToken(payload: object, expiresIn: string | number = "15m"): string {
  const options = { expiresIn } as unknown as SignOptions;
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
