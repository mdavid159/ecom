import { Controller, Param, Delete, Get, Query } from '@nestjs/common';
import { CheckoutSuccessService } from './checkout-success.service';
import { SendCheckoutEmailDto } from '../auth/dto/send-checkout.dto';

@Controller('checkout')
export class CheckoutSuccessController {
  constructor(private checkoutSuccessService: CheckoutSuccessService) {}

  @Get('success')
  async sendCheckoutEmail(@Query() query: SendCheckoutEmailDto) {
    return this.checkoutSuccessService.sendCheckoutEmail(query);
  }

  @Delete('delete/:id')
  deleteProductAfterBuying(@Param('id') id: string) {
    return this.checkoutSuccessService.deleteProductAfterBuying(id);
  }
}
