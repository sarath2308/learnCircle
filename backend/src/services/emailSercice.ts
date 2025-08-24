import nodemailer from 'nodemailer'

interface EmailOptions { 
    to: string;
     subject: string;
      html: string; 
    }
    
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private async sendMail(options: EmailOptions) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }

  async sendSignupOtp(to: string, otp: string) {
    const html = `<h1>Your Signup OTP is ${otp}</h1>`;
    await this.sendMail({ to, subject: "Signup OTP", html });
  }

  async sendForgotPasswordOtp(to: string, otp: string) {
    const html = `<h1>Your Password Reset OTP is ${otp}</h1>`;
    await this.sendMail({ to, subject: "Forgot Password OTP", html });
  }
}
