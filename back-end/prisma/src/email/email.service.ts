import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
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

  // Send verification email
  async sendVerificationEmail(
    recipientEmail: string,
    token: string,
  ): Promise<void> {
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
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>Thank you for registering with us! Please use the code below to verify your email address:</p>
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

    await this.sendEmail(recipientEmail, 'Verify Your Email', htmlTemplate);
  }

  // Send password reset email
  async sendPasswordResetEmail(
    recipientEmail: string,
    token: string,
  ): Promise<void> {
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
            background-color: #FF5722;
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
            color: #FF5722;
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
            color: #FF5722;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>We received a request to reset your password. Use the code below to reset it:</p>
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

    await this.sendEmail(
      recipientEmail,
      'Password Reset Request',
      htmlTemplate,
    );
  }

  async sendConfirmationEmail(
    recipientEmail: string,
    userName: string,
    orderItems: { name: string; price: number; quantity: number }[],
    totalPrice: number,
  ) {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
          color: #333;
        }
    
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
    
        .header {
          background-color: #4CAF50;
          color: white;
          text-align: center;
          padding: 20px;
        }
    
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
    
        .content {
          padding: 20px;
          line-height: 1.6;
        }
    
        .content p {
          margin: 10px 0;
        }
    
        .content strong {
          color: #4CAF50;
        }
    
        .product-details {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
    
        .product-details th, .product-details td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
    
        .product-details th {
          background-color: #f2f2f2;
        }
    
        .product-details tbody tr:nth-child(even) {
          background-color: #f9f9f9;
        }
    
        .footer {
          background-color: #f4f4f4;
          text-align: center;
          padding: 15px;
          font-size: 14px;
          color: #666;
        }
    
        .footer a {
          color: #4CAF50;
          text-decoration: none;
        }
    
        .footer a:hover {
          text-decoration: underline;
        }
    
        @media (max-width: 600px) {
          .email-container {
            width: 100%;
            margin: 10px;
          }
    
          .header h1 {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Thank you for your order! Here are the details of your purchase:</p>
          <table class="product-details">
            <thead>
              <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Amount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems
                .map(
                  (item) => `
          <tr>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `,
                )
                .join('')}
            </tbody>
          </table>
          <h1>Grand Total: $${totalPrice}</h1>
          <p>We appreciate your business and hope you enjoy your purchase!</p>
          <p>If you have any questions, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Your Company Name. All rights reserved.</p>
          <p>Visit our website: <a href="https://example.com">example.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

    await this.sendEmail(
      recipientEmail,
      'Email confirmation request',
      htmlTemplate,
    );
  }
  // General method for sending email
  private async sendEmail(
    recipientEmail: string,
    subject: string,
    htmlBody: string,
  ): Promise<void> {
    const transporter = this.mailTransport();

    const mailOptions = {
      from: '"Your Company Name" <no-reply@yourcompany.com>',
      to: recipientEmail,
      subject: subject,
      html: htmlBody,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
      console.error(`Failed to send email: ${error.message}`);
      throw new Error('Email sending failed');
    }
  }
}
