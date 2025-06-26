import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from '../constants';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { ForgotPassModule } from '../forgot-pass/forgot-pass.module';
import { JwtAuthGuard } from './guards/jwt.guard';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../jwt.strategy';
import { SettingsService } from '../settings/settings.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ForgotPassModule,
    EmailModule,
    PrismaModule,
    SettingsModule,
    JwtModule.register({
      global: true,
      secret: JwtConstants.secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    EmailService,
    JwtAuthGuard,
    JwtStrategy,
    SettingsService,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
