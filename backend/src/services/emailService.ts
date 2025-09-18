import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async sendMail(options: EmailOptions) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }

  async sendSignupOtp(to: string, otp: string) {
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #4CAF50;">Welcome to LearnCircle!</h2>
      <p>Hi there,</p>
      <p>Thank you for signing up. Your One-Time Password (OTP) to complete the signup process is:</p>
      <h3 style="color: #FF5722;">${otp}</h3>
      <p>Please enter this code within the next 1 minutes.</p>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <hr>
      <p style="font-size: 12px; color: #888;">LearnCircle Team</p>
    </div>
  `;
    await this.sendMail({ to, subject: "Your LearnCircle Signup OTP", html });
  }

  async sendForgotPasswordOtp(to: string, otp: string) {
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #2196F3;">Reset Your Password</h2>
      <p>Hi there,</p>
      <p>We received a request to reset your password. Your OTP to reset your password is:</p>
      <h1 style="color: #FF5722;">${otp}</h1>
      <p>This OTP is valid for 1 minutes only.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <hr>
      <p style="font-size: 12px; color: #888;">LearnCircle Team</p>
    </div>
  `;
    await this.sendMail({ to, subject: "Password Reset OTP", html });
  }
}
