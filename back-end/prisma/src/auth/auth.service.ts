import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { ForgotPassDto } from './dto/forgot-pass.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LogoutDto } from './dto/logout.dto';

const random4Digit = () => Math.floor(1000 + Math.random() * 9000).toString(); // Ensures 4 digits

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password, name } = registerDto;
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prismaService.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        isVerified: false,
      },
    });

    const verificationToken = random4Digit();

    await this.prismaService.verificationToken.create({
      data: {
        email,
        tokenHash: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    await this.emailService.sendVerificationEmail(email, verificationToken);

    return { message: 'User successfully created, please verify your email' };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; redirect_url: string }> {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (isPasswordValid) {
      await this.prismaService.user.update({
        where: { email },
        data: {
          isLoggedIn: true,
        },
      });
    } else {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      redirect_url: `/auth/login/${user.id}`,
    };
  }

  async verifyEmail(
    userId: string,
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    const { token } = verifyEmailDto;

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const verificationRequest =
      await this.prismaService.verificationToken.findFirst({
        where: { email: user.email },
      });

    if (!verificationRequest || token !== verificationRequest.tokenHash) {
      throw new BadRequestException('Invalid verification token');
    }

    if (new Date() > verificationRequest.expiresAt) {
      throw new BadRequestException('Token expired');
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    await this.prismaService.verificationToken.delete({
      where: { id: verificationRequest.id },
    });

    return { message: 'User successfully verified' };
  }

  async forgotPassword(
    forgotPassDto: ForgotPassDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPassDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const passToken = random4Digit();

    await this.prismaService.forgotPassToken.create({
      data: {
        email,
        token: passToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    await this.emailService.sendPasswordResetEmail(email, passToken);

    return { message: 'Password reset email sent' };
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = updatePasswordDto;

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const resetRequest = await this.prismaService.forgotPassToken.findFirst({
      where: { email: user.email, token },
    });

    if (!resetRequest) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (new Date() > resetRequest.expiresAt) {
      throw new BadRequestException('Token has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    await this.prismaService.forgotPassToken.delete({
      where: { id: resetRequest.id },
    });

    return { message: 'Password reset successfully' };
  }

  async logOut(logout: LogoutDto): Promise<{ message: string }> {
    const { email } = logout;

    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user.isLoggedIn) {
      throw new BadRequestException('User already logged out');
    }

    await this.prismaService.user.update({
      where: { email },
      data: {
        isLoggedIn: false,
      },
    });

    return { message: 'User successfully logged out' };
  }

  decodeToken(token: string): { userId: string } {
    const decoded = this.jwtService.decode(token) as { sub: string };
    if (!decoded || !decoded.sub) {
      throw new Error('Invalid token or missing "sub" field');
    }
    return { userId: decoded.sub };
  }
}
