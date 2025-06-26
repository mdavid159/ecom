import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPassDto } from './dto/forgot-pass.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify-email/:id')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.authService.verifyEmail(id, verifyEmailDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPassDto: ForgotPassDto) {
    return this.authService.forgotPassword(forgotPassDto);
  }

  @Post('change-password/:id')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('id') id: string,
  ) {
    if (!id) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.authService.updatePassword(id, updatePasswordDto);
  }

  @Post('logout')
  logOut(@Body() logoutDto: LogoutDto) {
    return this.authService.logOut(logoutDto);
  }
}
