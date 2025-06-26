import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddToCartDto } from '../auth/dto/cartItem.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  async addCart(
    @Body() addCartDto: AddToCartDto,
  ): Promise<{ message: string }> {
    return this.cartService.addCart(addCartDto);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCartItems(userId);
  }

  @Delete('delete/:id')
  async deleteCartItem(@Param('id') id: string) {
    return this.cartService.deleteCartItem(+id);
  }

  @Patch('quantity')
  async increaseQuantity(
    @Body() body: { userId: string; productId: number; quantity: number },
  ) {
    const { userId, productId, quantity } = body;
    return this.cartService.increaseQuantity(userId, productId, quantity);
  }

  @Get('total-items/:id')
  async getTotalItems(@Param('id') id: string) {
    return this.cartService.getTotalItems(id);
  }

  @Get('total-price/:id')
  async getTotalPrice(@Param('id') id: string) {
    return this.cartService.getTotalPrice(id);
  }
}
