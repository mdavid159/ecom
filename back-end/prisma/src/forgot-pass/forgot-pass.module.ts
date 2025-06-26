import { Module } from '@nestjs/common';
import { ForgotPassService } from './forgot-pass.service';

@Module({
  providers: [ForgotPassService],
  exports: [ForgotPassService],
})
export class ForgotPassModule {}
