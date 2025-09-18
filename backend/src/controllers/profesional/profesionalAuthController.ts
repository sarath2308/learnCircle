import { IAuthController } from "../../types/common/learnerAuthController";
import { Request,Response,NextFunction } from "express";
import { LearnerAuthController } from "../learner/learnerAuthController";
import { IAuthService } from "../../types/common/IAuthService";
import { IProfessional } from "../../models/profesionals";
export interface IResponse
{
  user: any;        
  accessToken: string;
}

export class ProfesionalAuthController extends LearnerAuthController
{
    constructor(private profesionalService:IAuthService<IProfessional>)
    {
      super(profesionalService)
    }
}