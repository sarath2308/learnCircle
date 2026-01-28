import { TYPES } from "@/types/shared/inversify/types";
import { ITokenService } from "@/utils";
import { inject, injectable } from "inversify";

export interface ISocketAuthMiddleware {
  handle: (socket: any, next: (err?: Error) => void) => Promise<void>;
}

@injectable()
export class SocketAuthMiddleware implements ISocketAuthMiddleware {
  constructor(
    @inject(TYPES.ITokenService)
    private _tokenService: ITokenService,
  ) {}

  async handle(socket: any, next: (err?: Error) => void): Promise<void> {
    console.log("🔐 SocketAuthMiddleware invoked");

    try {
      const cookie = socket.handshake.headers.cookie;
      console.log("🍪 cookies:", cookie);

      if (!cookie) {
        console.error("❌ No cookie header");
        return next(new Error("No cookie"));
      }

      const token = cookie
        .split("; ")
        .find((c: string) => c.startsWith("accessToken="))
        ?.split("=")[1];

      console.log("🎫 accessToken:", token ? "FOUND" : "MISSING");

      if (!token) {
        return next(new Error("No token"));
      }

      const user = await this._tokenService.verifyAccessToken(token);
      console.log("👤 token payload:", user);

      if (!user || !user.userId) {
        console.error("❌ Invalid user payload");
        return next(new Error("Invalid user"));
      }

      socket.data.user = user;
      console.log("✅ Socket authenticated:", user.id);

      next();
    } catch (err) {
      console.error("❌ Socket auth failed:", err);
      next(new Error("Unauthorized"));
    }
  }
}
