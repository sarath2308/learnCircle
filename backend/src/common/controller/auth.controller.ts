// import { IAuthController } from "@/learner";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { AppError, Messages, setTokens } from "@/common";
import { HttpStatus } from "@/common";
import { IAuthOrchestrator } from "../services/auth.orchestrator";
import { Providers } from "../constants/providers";
import { TYPES } from "@/common";

export interface IAuthController {
  reqSignup(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  verifyAndSignup(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  resendSignupOtp(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  login(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  forgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  resendForgotOtp(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  verifyForgotOtp(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  googleSign(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

export interface IResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}
@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.IAuthOrchestrator) private _auth: IAuthOrchestrator) {}
  async reqSignup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        throw new Error("credential missing");
      }
      const response = await this._auth.reqSignup(name, email, password, role);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async verifyAndSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email, token } = req.body;
      if (!email || !otp) {
        throw new AppError(Messages.BAD_REQUEST, HttpStatus.BAD_REQUEST);
      }
      const result = await this._auth.signup(email, token, otp);
      setTokens(res, result?.tokens.accessToken!, result?.tokens.refreshToken);

      return res.status(HttpStatus.OK).json({ user: result?.user });
    } catch (error) {
      next(error);
    }
  }

  async resendSignupOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      if (!token) {
        throw new AppError(Messages.BAD_REQUEST, HttpStatus.BAD_REQUEST);
      }
      let result = await this._auth.resendSignupOtp(token);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password, role } = req.body;
    try {
      const result = await this._auth.login(email, password, role);
      setTokens(res, result?.tokens.accessToken!, result?.tokens.refreshToken);

      res.status(HttpStatus.OK).json({ user: result?.user });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email, role } = req.body;
    try {
      let result = await this._auth.forgotPassword(email, role);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  async resendForgotOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, role } = req.body;
      let result = await this._auth.resendForgotOtp(email, role);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  async verifyForgotOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, role } = req.body;
      let result = await this._auth.verifyForgotOtp(email, otp, role);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, token, newPassword, role } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      let result = await this._auth.resetPassword(token, email, newPassword, role);

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    return res.json();
  }

  async googleSign(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, role } = req.body;
      if (!token) {
        throw new Error("token missing");
      }
      const result = await this._auth.providersSignin(Providers.Google, token, role);
      setTokens(res, result?.tokens.accessToken!, result?.tokens.refreshToken);
      res.status(HttpStatus.OK).json({ user: result?.user });
    } catch (error) {
      next(error);
    }
  }
}
