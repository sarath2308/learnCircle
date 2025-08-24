import { IAuthController } from "../../types/common/learnerAuthController";
import { IlearnerAuthService } from "../../services/learner/learnerAuthService";

import { Request,Response,NextFunction } from "express";

export class LearnerAuthController implements Partial<IAuthController>{

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
    async login(req:Request,res:Response):Promise<Response>
    {
         return res.json()
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