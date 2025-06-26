import { Injectable } from '@nestjs/common';
import { AddToCartDto } from '../auth/dto/cartItem.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}
  async addCart(addToCart: AddToCartDto): Promise<{ message: string }> {
    const { userId, productId, price, imageUrl, quantity, name } = addToCart;

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    const existingItem = await this.prismaService.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existingItem) {
      await this.prismaService.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await this.prismaService.cartItem.create({
        data: {
          userId,
          productId,
          name,
          quantity,
          price,
          imageUrl,
        },
      });
    }

    return { message: 'Product successfully added to cart!' };
  }

  async getCartItems(userId: string) {
    return this.prismaService.cartItem.findMany({
      where: { userId },
    });
  }

  async deleteCartItem(productId: number): Promise<{ message: string }> {
    await this.prismaService.cartItem.delete({
      where: { id: productId },
    });

    return { message: 'Product successfully deleted' };
  }

  async increaseQuantity(
    userId: string,
    productId: number,
    quantity: number,
  ): Promise<{ message: string }> {
    const existingItem = await this.prismaService.cartItem.findFirst({
      where: { userId, productId },
    });

    if (!existingItem) {
      throw new Error('Cart item not found.');
    }

    await this.prismaService.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: (existingItem.quantity = quantity) },
    });

    return { message: 'Quantity increased successfully.' };
  }

  async getTotalItems(userId: string): Promise<number> {
    const cartItems = await this.prismaService.cartItem.findMany({
      where: { userId },
      select: { quantity: true },
    });

    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  async getTotalPrice(userId: string): Promise<number> {
    const finalPrice = await this.prismaService.cartItem.findMany({
      where: { userId },
      select: { price: true, quantity: true },
    });

    return finalPrice.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }
}
