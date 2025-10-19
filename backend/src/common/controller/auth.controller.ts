// import { IAuthController } from "@/learner";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { setTokens } from "../middleware";
import { HttpStatus } from "@/common";
import { IAuthOrchestrator } from "@/common";
import { Providers } from "../constants/providers";
import { TYPES } from "@/common";
import { IAuthController } from "../interface/IAuthController";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.IAuthOrchestrator) private _auth: IAuthOrchestrator) {}
  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async reqSignup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email, password, role } = req.body;
      const response = await this._auth.reqSignup(name, email, password, role);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async verifyAndSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.body;
      const result = await this._auth.signup(email, otp);
      setTokens(res, result?.tokens.accessToken!, result?.tokens.refreshToken);

      return res.status(HttpStatus.OK).json({ user: result?.user });
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async resendSignupOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      let result = await this._auth.resendSignupOtp(email);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
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
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email, role } = req.body;
    try {
      let result = await this._auth.forgotPassword(email, role);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async resendForgotOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, role } = req.body;
      let result = await this._auth.resendForgotOtp(email, role);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async verifyForgotOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, role } = req.body;
      let result = await this._auth.verifyForgotOtp(email, otp, role);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, token, newPassword } = req.body;

      let result = await this._auth.resetPassword(token, email, newPassword);

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async logout(req: Request, res: Response): Promise<Response> {
    return res.json();
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async googleSign(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, role } = req.body;
      const result = await this._auth.providersSignin(Providers.Google, token, role);
      setTokens(res, result?.tokens.accessToken!, result?.tokens.refreshToken);
      res.status(HttpStatus.OK).json({ user: result?.user });
    } catch (error) {
      next(error);
    }
  }
}
