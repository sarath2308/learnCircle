import { ILearnerRepo } from "../../Repositories/learner/learnerRepo";
import { ILearner } from "../../models/Learner";
import { EmailService } from "../emailSercice";
import { GenerateOtp } from "../../utils/otp.utils.";
import { AccessToken } from "../../utils/access.jwt";
import { IRedisRepository } from "../../Repositories/redisRepo";
import { error } from "console";
import { IpasswordService } from "../passwordService";

export interface IlearnerAuthService
{
    signup:(name:string,email:string,password:string)=>Promise<Object>;
    login:(email:string,password:string)=>Promise<void>;
    forgotPassword:(email:string)=>Promise<void>
    resetPassword:(id:string,newPassword:string)=>Promise<void>
    verifyOtp?:(email:string,otp:string)=>Promise<void>

}

export class LearnerAuthService implements IlearnerAuthService
{
    constructor(
        private userRepo:ILearnerRepo<ILearner>,
        private emailService:EmailService,
        private OtpService:GenerateOtp,
        private accesToken:AccessToken,
        private redis:IRedisRepository<any>,
        private passwordService:IpasswordService
     )
    {}
    async signup(name:string,email:string,password:string):Promise<Object>
    {
        try{
        
        let match=await this.userRepo.findByEmail(email)

        if(match){
            throw new Error("already exist")
         }
        const otp=this.OtpService.getOtp()
        let hashPassword=this.passwordService.hashPassword(password)
        //redis
         await this.redis.set(`signup:${email}`,{name,email,hashPassword,otp},60)
         //email
         await this.emailService.sendSignupOtp(email,otp)

         return {message:"otp sent fro verification"};

        }catch(err:any) {
           if(err.code===11000)
           {
            throw new Error("duplicate_error")
           }
           else
           {
            throw err;
           }
          }
}

    async login(email:string,password:string)
    {

    }
    async forgotPassword(email: string) 
    {

    }
    async resetPassword(id:string,newPassword:string)
    {

    }
    async verifyOtp(email:string,otp:string)
    {

    }
}