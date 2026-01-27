export interface ISocketHandler {
  register: (io: any, socket: any) => void;
}
