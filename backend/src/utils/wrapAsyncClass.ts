import { Request, Response, NextFunction } from "express";

export function wrapAsyncController<T extends { [key: string]: any }>(controller: T): T {
  const proto = Object.getPrototypeOf(controller);
  const methodNames = Object.getOwnPropertyNames(proto).filter(
    (name) => typeof controller[name] === "function" && name !== "constructor",
  );

  methodNames.forEach((name) => {
    const original = controller[name].bind(controller);
    (controller as any)[name] = (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(original(req, res, next)).catch(next);
    };
  });

  return controller;
}
