import { IChatService } from "@/interface/shared/chat/chat.service.interface";
import { ISocketHandler } from "@/interface/shared/socket/socket.handler.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class SocketHandler implements ISocketHandler {
  constructor(
    @inject(TYPES.IChatService)
    private _chatService: IChatService,
  ) {}

  register(io: any, socket: any) {
    // 🔍 CONNECTION DEBUG
    console.log("🟢 SOCKET CONNECTED");
    console.log("socket.id:", socket.id);
    console.log("namespace:", socket.nsp.name);
    console.log("handshake url:", socket.handshake.url);
    console.log("auth:", socket.handshake.auth);
    console.log("headers:", socket.handshake.headers);

    // 🔴 AUTH SAFETY CHECK (VERY IMPORTANT)
    if (!socket.data?.user?.userId) {
      console.error("❌ socket.data.user is missing");
      socket.emit("chat:error", "Unauthenticated socket");
      socket.disconnect();
      return;
    }

    const userId = socket.data.user.userId;
    console.log("✅ Authenticated user:", userId);

    // 🏠 user-level room
    const userRoom = `user:${userId}`;
    socket.join(userRoom);
    console.log(`📦 Joined room: ${userRoom}`);

    socket.on("chat:join", ({ conversationId }: { conversationId: string }) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`📦 socket ${socket.id} joined conversation:${conversationId}`);
    });

    // 🔥 EVENT DEBUG
    socket.on(
      "chat:send",
      async ({ conversationId, content }: { conversationId: string; content: string }) => {
        console.log("📩 chat:send received");
        console.log("conversationId:", conversationId);
        console.log("content:", content);

        // ❌ HARD GUARD
        if (!conversationId) {
          console.error("❌ conversationId is missing");
          socket.emit("chat:error", "conversationId is required");
          return;
        }

        try {
          const message = await this._chatService.sendMessage(userId, conversationId, content);

          console.log("✅ Message saved:", message.id);

          io.to(`conversation:${conversationId}`).emit(`chat:message`, message);
          socket.on("chat:leave", ({ conversationId }: { conversationId: string }) => {
            socket.leave(`conversation:${conversationId}`);
          });
        } catch (err: any) {
          console.error("❌ chat:send error:", err);
          socket.emit("chat:error", err.message);
        }
      },
    );

    // 🔌 DISCONNECT DEBUG
    socket.on("disconnect", (reason: unknown) => {
      console.warn("🔌 SOCKET DISCONNECTED");
      console.warn("socket.id:", socket.id);
      console.warn("reason:", reason);
    });
  }
}
