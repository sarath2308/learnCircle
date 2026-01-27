import { TYPES } from "@/types/shared/inversify/types";
import { ITokenService } from "@/utils";
import { inject, injectable } from "inversify";

export interface ISocketAuthMiddleware {
  handle: (socket: any, next: (err?: Error) => void) => Promise<void>;
}

@injectable()
export class SocketAuthMiddleware implements ISocketAuthMiddleware {
  constructor(@inject(TYPES.ITokenService) private _tokenService: ITokenService) {}

  async handle(socket: any, next: (err?: Error) => void): Promise<void> {
    try {
      const cookie = socket.handshake.headers.cookie;
      if (!cookie) throw new Error("No cookie");

      const token = cookie
        .split("; ")
        .find((c: string) => c.startsWith("accessToken="))
        ?.split("=")[1];

      if (!token) throw new Error("No token");

      const user = await this._tokenService.verifyAccessToken(token);
      socket.data.user = user;

      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  }
}
