import { IsEmail, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
