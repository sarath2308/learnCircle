import { IAuthController } from "../../types/common/learnerAuthController";

import { Request,Response } from "express";

export class LearnerAuthController implements IAuthController{

    constructor()
    {
        
    }
    async signup(req:Request,Res:Response)
    {
       
    }
    async login(req:Request,res:Response)
    {

    }
    async refreshToken(req:Request,res:Response)
    {

    }
    async resetPassword(req:Request,res:Response)
    {

    }
    async forgotPassword(req:Request,res:Response)
    {

    }
    async logout(req:Request,res:Response)
    {

    }
}