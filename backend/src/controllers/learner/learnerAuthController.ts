import { IAuthController } from "../../types/common/learnerAuthController";
import { IlearnerAuthService } from "../../services/learner/learnerAuthService";
import { Request,Response,NextFunction } from "express";

export interface IResponse
{
  user: any;        
  accessToken: string;
}

export class LearnerAuthController implements IAuthController{

    constructor(private learnerAuth:IlearnerAuthService)
    {
    }
    async signup(req:Request,res:Response,next:NextFunction):Promise<Response|void>
    {
        try {
               const {name,email,password}=req.body;
               const response=await this.learnerAuth.signup(name,email,password)
               return res.status(200).json(response)
        } catch (error:any) {
            console.error(error)
            if(error.message==='duplicate_error')
            {
               return res.status(409).json({message:"email already exists please login"})
            }
            else{
              next(error)
            }
            
        }
    }

    async verifyOtp(req:Request,res:Response)
        {
          const {otp,email,type}=req.body;
             if (!email || !otp) {
                return res.status(400).json({ message: "Email and OTP are required" });
                }
          try {
      const result= await this.learnerAuth.verifyOtp(email, otp,type);

      if(type==='forgot')
      {
        if (type === 'forgot') {
      return res.status(200).json({ message: result.message,user: result.user });
              }
      }
      else
      {

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });

  
      res.status(200).json({ user: result.user });
    }
    } catch (error: any) {
      res.status(400).json({ message: error.message || "OTP verification failed" });
    }
        }


    async login(req:Request,res:Response)
    {
      const {email,password}=req.body;
       try {
         let result:IResponse=await this.learnerAuth.login(email,password)
         res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });

  
      res.status(200).json({ user: result.user });
       } catch (error:any) {
        console.log(error)
        res.status(401).json({ message: error.message || "Login failed" });
       }
    }
    async refreshToken(req:Request,res:Response):Promise<Response>
    {
      return res.json()
    }
    async resetPassword(req:Request,res:Response):Promise<Response>
    {
       return res.json()
    }
    async forgotPassword(req:Request,res:Response):Promise<Response>
    {
         return res.json()
    }
    async logout(req:Request,res:Response):Promise<Response>
    {
         return res.json()
    }
}