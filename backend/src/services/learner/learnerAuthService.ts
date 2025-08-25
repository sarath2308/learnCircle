import { ILearnerRepo } from "../../Repositories/learner/learnerRepo";
import { ILearner } from "../../models/Learner";
import { EmailService } from "../emailService";
import { GenerateOtp } from "../../utils/otp.utils.";
import { AccessToken } from "../../utils/access.jwt";
import { IRedisRepository } from "../../Repositories/redisRepo";
import { error } from "console";
import { IpasswordService } from "../passwordService";


export interface IlearnerAuthService
{
    signup:(name:string,email:string,password:string)=>Promise<Object>;
    login:(email:string,password:string)=>Promise<any>;
    forgotPassword:(email:string)=>Promise<void>
    resetPassword:(id:string,newPassword:string)=>Promise<void>
    verifyOtp:(email:string,otp:string,type:string)=>Promise<any>

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
        let passwordHash=await this.passwordService.hashPassword(password)
        //redis
         await this.redis.set(`signup:${email}`,JSON.stringify({name,email,passwordHash:passwordHash,otp}),60)
         //email
         await this.emailService.sendSignupOtp(email,otp)

         return {message:"otp sent for verification"};

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
      try{
       let match=await this.userRepo.findByEmail(email)
       if(match)
       {
        let check=await this.passwordService.comparePassword(match.passwordHash,password)
        if(!check)
        {
          throw new Error("incorrect Password")
        }
         let jwt=await this.accesToken.signAccessToken({id:match.id,role:match.role})

          return {user:match,accessToken:jwt}
       }
       else{
        throw new Error("user not found")
       }
       
       }catch(err:any)
      {
         throw new Error(err)
      }
    }
    async forgotPassword(email: string) 
    {
        
    }
    async resetPassword(id:string,newPassword:string)
    {

    }
  async verifyOtp(email: string, otp: string, type: string) {
  const stored = await this.redis.get(`signup:${email}`);
  if (!stored) {
    throw new Error("OTP expired or not found");
  }

  const match = JSON.parse(stored);

  if (match.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  try {
    if (type === "signup") {
      const user = await this.userRepo.create({
        ...match,
        passwordHash: match.passwordHash, 
      });
      // already hashed when stored

      if (!user) {
        throw new Error("User creation returned null/undefined");
      }


      await this.redis.delete(`signup:${email}`);

      const jwt = await this.accesToken.signAccessToken({
        id: user.id,
        role: match.role,
      });

      return { user, accessToken: jwt };
    } else {
      const User = await this.userRepo.findByEmail(email);

      if (!User) {
        throw new Error("User not found for OTP verification");
      }

      await this.redis.delete(`signup:${email}`);

      return {
        message: "OTP verified",
        user: { id: User.id, name: User.name,email:User.email },
      };
    }
  } catch (err: any) {
    await this.redis.delete(`signup:${email}`).catch(() => {
      console.warn(`Failed to remove OTP for ${email}`);
    });
    throw new Error(err.message || "Failed to verify OTP");
  }
}

}