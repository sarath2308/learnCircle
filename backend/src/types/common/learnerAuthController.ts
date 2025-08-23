import { Request,Response } from "express";

export interface IAuthController{
    login:(req:Request,res:Response)=>Promise<void>
    signup:(req:Request,res:Response)=>Promise<void>
    refreshToken:(req:Request,res:Response)=>Promise<void>
    logout:(req:Request,res:Response)=>Promise<void>
    forgotPassword:(req:Request,res:Response)=>Promise<void>
    resetPassword:(req:Request,res:Response)=>Promise<void>
}