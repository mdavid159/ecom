import { IsString, IsEmail } from 'class-validator';

export class SendCheckoutEmailDto {
  @IsString()
  userId: string;

  @IsEmail()
  recipientEmail: string;
}
