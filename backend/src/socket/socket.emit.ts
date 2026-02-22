import { ISocketEmitService } from "@/interface/shared/socket/socket.emit.interface";
import { getIO } from ".";

export class SocketEmitService implements ISocketEmitService {
  async emitToRoom(
    room: string,
    event: string,
    payload: { title: string; message: string },
  ): Promise<void> {
    const io = getIO();
    io.to(room).emit(event, payload);
  }
  async emitToUser(
    userId: string,
    event: string,
    payload: { title: string; message: string },
  ): Promise<void> {
    const io = getIO();
    io.to(userId).emit(event, payload);
  }
}
