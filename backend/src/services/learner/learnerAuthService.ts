



export interface IlearnerAuthService
{
    signup:(name:string,email:string,password:string)=>Promise<void>;
    login:(email:string,password:string)=>Promise<void>;
    forgotPassword:(email:string)=>Promise<void>
    resetPassword:(id:string,newPassword:string)=>Promise<void>
    verifyOtp?:(email:string,otp:string)=>Promise<void>

}

export class LearnerAuthService implements IlearnerAuthService
{
    constructor()
    {

    }
    async signup(name:string,email:string,password:string)
    {

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