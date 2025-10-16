import { Request, Response, NextFunction } from "express";

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
