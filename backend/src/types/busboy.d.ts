import { Writable } from "stream";
import { IncomingHttpHeaders } from "http";

declare module "busboy" {
  interface BusboyConfig {
    headers: IncomingHttpHeaders;
    limits?: {
      fileSize?: number;
      files?: number;
      fields?: number;
    };
  }

  interface BusboyFileInfo {
    filename: string;
    encoding: string;
    mimeType: string;
  }

  class Busboy extends Writable {
    constructor(config: BusboyConfig);

    on(
      event: "file",
      callback: (fieldname: string, file: NodeJS.ReadableStream, info: BusboyFileInfo) => void,
    ): this;

    on(event: "field", callback: (fieldname: string, value: string, info: any) => void): this;

    on(event: "finish", callback: () => void): this;
    on(event: "error", callback: (err: Error) => void): this;
  }

  export = Busboy;
}
