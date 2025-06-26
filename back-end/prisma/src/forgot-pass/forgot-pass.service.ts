import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ForgotPassService {
  private mailTransport() {
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 587,
      secure: false, // True for 465, false for other ports
      auth: {
        user: 'd46ca6125c31b3', // Replace with your Mailtrap credentials
        pass: 'ed56902a8bb548',
      },
    });
  }

  async sendPassToken(recipientEmail: string, token: string): Promise<void> {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .token {
            font-size: 28px;
            font-weight: bold;
            color: #4CAF50;
            margin: 20px 0;
          }
          .footer {
            background-color: #f1f1f1;
            color: #777;
            text-align: center;
            padding: 15px;
            font-size: 12px;
          }
          .footer a {
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Forgot your password</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>Please use the code below to change your password:</p>
            <div class="token">${token}</div>
            <p>If you didn’t request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Company Name. All rights reserved.</p>
            <p>
              <a href="https://yourwebsite.com/privacy-policy">Privacy Policy</a> |
              <a href="https://yourwebsite.com/terms">Terms of Service</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = this.mailTransport();

    const mailOptions = {
      from: '"Your Company Name" <no-reply@yourcompany.com>', // Sender address
      to: recipientEmail, // List of recipients
      subject: 'Change Password', // Subject line
      html: htmlTemplate, // HTML body content
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${recipientEmail}`);
    } catch (error) {
      console.error(`Failed to send email: ${error.message}`);
      throw new Error('Email sending failed');
    }
  }
}
