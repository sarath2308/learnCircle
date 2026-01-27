import { IChatService } from "@/interface/shared/chat/chat.service.interface";
import { ISocketHandler } from "@/interface/shared/socket/socket.handler.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class SocketHandler implements ISocketHandler {
  constructor(@inject(TYPES.IChatService) private _chatService: IChatService) {}

  register(io: any, socket: any) {
    const userId = socket.data.user.id;

    // user-level room
    socket.join(`user:${userId}`);

    socket.on(
      "chat:send",
      async ({ conversationId, content }: { conversationId: string; content: string }) => {
        try {
          const message = await this._chatService.sendMessage(userId, conversationId, content);

          io.to(`user:${message.receiverId}`).emit("chat:message", message);

          socket.emit("chat:message", message);
        } catch (err: any) {
          socket.emit("chat:error", err.message);
        }
      },
    );
  }
}
