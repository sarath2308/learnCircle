import { Request, Response } from "express";
import { TYPES } from "../../types/types";
import { AdminAuthService } from "../../services/admin/admin.auth.service";
import { injectable, inject } from "inversify";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messages";
import { setTokens } from "../../middleware/setToken";
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
