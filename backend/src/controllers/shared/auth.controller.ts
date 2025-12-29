// import { IAuthController } from "@/learner";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { setTokens } from "@/middleware";
import { IAuthOrchestrator } from "@/interface/shared/auth/auth.orchestrator.interface";
import { Providers } from "@/constants/shared/providers";
import { TYPES } from "@/types/shared/inversify/types";
import { IAuthController } from "@/interface/shared/auth/auth.controller.interface";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";

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
  async reqSignup(req: Request, res: Response): Promise<Response | void> {
    const { name, email, password, role } = req.body;
    const response = await this._auth.reqSignup(name, email, password, role);
    return res.status(HttpStatus.OK).json(response);
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async verifyAndSignup(req: Request, res: Response) {
    const { otp, email } = req.body;
    const result = await this._auth.signup(email, otp);
    setTokens(res, result?.tokens.accessToken!, result?.tokens.refreshToken);

    return res.status(HttpStatus.OK).json({ user: result?.user });
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async resendSignupOtp(req: Request, res: Response) {
    const { email } = req.body;

    let result = await this._auth.resendSignupOtp(email);
    res.status(HttpStatus.CREATED).json(result);
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async login(req: Request, res: Response) {
    const { email, password, role } = req.body;

    const result = await this._auth.login(email, password, role);
    setTokens(res, result?.tokens.accessToken!, result?.tokens.refreshToken);

    res.status(HttpStatus.OK).json({ user: result?.user });
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async forgotPassword(req: Request, res: Response) {
    const { email, role } = req.body;

    let result = await this._auth.forgotPassword(email, role);
    res.status(HttpStatus.OK).json(result);
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async resendForgotOtp(req: Request, res: Response) {
    const { email, role } = req.body;
    let result = await this._auth.resendForgotOtp(email, role);
    res.status(HttpStatus.OK).json(result);
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async verifyForgotOtp(req: Request, res: Response) {
    const { email, otp, role } = req.body;
    let result = await this._auth.verifyForgotOtp(email, otp, role);
    res.status(HttpStatus.OK).json(result);
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async resetPassword(req: Request, res: Response) {
    const { email, token, newPassword } = req.body;

    let result = await this._auth.resetPassword(token, email, newPassword);

    return res.status(HttpStatus.OK).json(result);
  }
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async logout(req: IAuthRequest, res: Response): Promise<void> {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: Messages.LOGOUT_SUCCESS,
    });
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async googleSign(req: Request, res: Response) {
    const { token, role } = req.body;
    const result = await this._auth.providersSignin(Providers.Google, token, role);
    setTokens(res, result.tokens.accessToken!, result?.tokens.refreshToken);
    res.status(HttpStatus.OK).json({ user: result?.user });
  }
}
