import { Module } from '@nestjs/common';
import { CheckoutSuccessService } from './checkout-success.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CheckoutSuccessController } from './checkout-success.controller';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [PrismaModule, AuthModule, EmailModule],
  controllers: [CheckoutSuccessController],
  providers: [
    CheckoutSuccessService,
    EmailService,
    PrismaService,
    AuthService,
    AuthModule,
  ],
})
export class CheckoutSuccessModule {}
