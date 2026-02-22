export interface ISocketEmitService {
  emitToUser: (userId: string, event: string, payload: any) => Promise<void>;
  emitToRoom: (room: string, event: string, payload: any) => Promise<void>;
}
