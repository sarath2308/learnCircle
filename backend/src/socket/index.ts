import { Server } from "socket.io";
import { ISocketAuthMiddleware } from "@/middleware/socket/socket.auth.middleware";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import container from "@/di/di.container";
import { ISocketHandler } from "@/interface/shared/socket/socket.handler.interface";
import { TYPES } from "@/types/shared/inversify/types";

const SocketHandler = wrapAsyncController(container.get<ISocketHandler>(TYPES.ISocketHandler));
const SocketMiddleware = wrapAsyncController(
  container.get<ISocketAuthMiddleware>(TYPES.ISocketAuthMiddleware),
);

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
    connectionStateRecovery: {},
  });

  // GLOBAL SOCKET AUTH
  io.use(SocketMiddleware.handle);

  io.on("connection", (socket) => {
    console.log("User Connected");
    SocketHandler.register(io, socket);
  });
};
