import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { PrismaModule } from './prisma/prisma.module';
import { ForgotPassService } from './forgot-pass/forgot-pass.service';
import { ForgotPassModule } from './forgot-pass/forgot-pass.module';
import { CreateModule } from './create/create.module';
import { CartModule } from './cart/cart.module';
import { CheckoutSuccessController } from './checkout-success/checkout-success.controller';
import { CheckoutSuccessModule } from './checkout-success/checkout-success.module';
import { CheckoutSuccessService } from './checkout-success/checkout-success.service';
import { SettingsController } from './settings/settings.controller';
import { SettingsModule } from './settings/settings.module';
import { SettingsService } from './settings/settings.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    UserModule,
    EmailModule,
    PrismaModule,
    ForgotPassModule,
    CreateModule,
    CartModule,
    CheckoutSuccessModule,
    SettingsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController, CheckoutSuccessController, SettingsController],
  providers: [
    AppService,
    ForgotPassService,
    CheckoutSuccessService,
    SettingsService,
  ],
})
export class AppModule {}
