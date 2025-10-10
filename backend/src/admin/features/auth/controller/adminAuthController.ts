import { Request, Response } from "express";
import { TYPES } from "../../../../common/types/inversify/types";
import { AdminAuthService } from "@/admin";
import { injectable, inject } from "inversify";
import { HttpStatus } from "../../../../common/constants/httpStatus";
import { Messages } from "@/common";
import { setTokens } from "@/common";
@injectable()
export class AdminAuthController {
  constructor(@inject(TYPES.AdminAuthService) private service: AdminAuthService) {}
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.service.login(email, password);
      setTokens(res, result?.access, result?.refresh);
      return res.status(HttpStatus.OK).json({ message: "login sucess" });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
      console.log(error);
    }
  }
}
