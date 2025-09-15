import { Request,Response,NextFunction } from "express";

export interface IAuthController{
    login:(req:Request,res:Response,next:NextFunction)=>Promise<Response|void>
    signup:(req:Request,res:Response,next:NextFunction)=>Promise<Response|void>
    refreshToken:(req:Request,res:Response,next:NextFunction)=>Promise<Response|void>
    getOtp:(req:Request,res:Response,next:NextFunction)=>Promise<Response | void>
    logout:(req:Request,res:Response,next:NextFunction)=>Promise<Response|void>
    forgotPassword:(req:Request,res:Response,next:NextFunction)=>Promise<Response|void>
    resetPassword:(req:Request,res:Response,next:NextFunction)=>Promise<Response|void>
    verifyOtp:(req:Request,res:Response,next:NextFunction)=>Promise<Response|void>
    resendOtp:(req:Request,res:Response,next:NextFunction)=>Promise<Response|void>
}