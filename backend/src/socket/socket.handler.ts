import { IChatService } from "@/interface/shared/chat/chat.service.interface";
import { ISessionBookingService } from "@/interface/shared/session-booking/booking/session.booking.service.interface";
import { ISocketHandler } from "@/interface/shared/socket/socket.handler.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class SocketHandler implements ISocketHandler {
  constructor(
    @inject(TYPES.IChatService)
    private _chatService: IChatService,
    @inject(TYPES.ISessionBookingService) private sessionBookingService: ISessionBookingService,
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

    // 🎥 VIDEO CHAT EVENTS---------------------------------------------

    socket.on("join-room", async ({ roomId }: { roomId: string }) => {
      try {
        const bookingId = roomId.replace("session_", "");
        const userId = socket.data.user.userId;

        // Reuse the SAME logic as Phase 1 (or call that service)
        const { roomId: allowedRoom } = await this.sessionBookingService.checkJoinPermission(
          bookingId,
          userId,
        );

        // If no error thrown, user is allowed
        socket.join(allowedRoom);
        const room = io.sockets.adapter.rooms.get(allowedRoom);
        const count = room ? room.size : 0;

        if (count > 2) {
          socket.leave(allowedRoom);
          socket.emit("join-error", { message: "Room is full" });
          return;
        }
        socket.emit("joined-room", { roomId: allowedRoom });

        // Optional: notify the other peer
        socket.to(allowedRoom).emit("peer-joined");

        console.log(`User ${userId} joined ${allowedRoom}`);
      } catch (err: any) {
        socket.emit("join-error", { message: err.message || "Not allowed" });
      }
    });

    socket.on("leave-room", ({ roomId }: { roomId: string }) => {
      socket.leave(roomId);
    });

    //WEBRTC SIGNALING
    socket.on("webrtc:offer", ({ roomId, offer }: { roomId: string; offer: any }) => {
      socket.to(roomId).emit("webrtc:offer", { offer });
    });

    socket.on("webrtc:answer", ({ roomId, answer }: { roomId: string; answer: any }) => {
      socket.to(roomId).emit("webrtc:answer", { answer });
    });

    socket.on(
      "webrtc:ice-candidate",
      ({ roomId, candidate }: { roomId: string; candidate: any }) => {
        socket.to(roomId).emit("webrtc:ice-candidate", { candidate });
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
