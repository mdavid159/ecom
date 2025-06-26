import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SendCheckoutEmailDto } from '../auth/dto/send-checkout.dto';

@Injectable()
export class CheckoutSuccessService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async sendCheckoutEmail(
    query: SendCheckoutEmailDto,
  ): Promise<{ message: string }> {
    const { userId, recipientEmail } = query;
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: recipientEmail },
        select: {
          email: true,
          name: true,
          cart: {
            where: { userId },
            select: {
              price: true,
              quantity: true,
              name: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found.');
      }

      const product = await this.prismaService.product.findFirst({
        where: { ByUser: recipientEmail },
        select: { name: true, price: true },
      });

      if (!product) {
        throw new Error('Product not found.');
      }

      if (!user.cart || user.cart.length === 0) {
        throw new Error('Cart is empty.');
      }

      const totalPrice = user.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const orderItems = user.cart.map((item) => {
        return {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        };
      });

      await this.emailService.sendConfirmationEmail(
        user.email,
        user.name,
        orderItems,
        totalPrice,
      );

      console.log('Checkout email sent successfully.');
      return { message: 'Email sent successfully' };
    } catch (err) {
      console.error('Error sending checkout email:', err.message);
      throw new Error(err.message || 'Failed to send email.');
    }
  }

  async deleteProductAfterBuying(userId: string): Promise<{ message: string }> {
    try {
      const deleted = await this.prismaService.cartItem.deleteMany({
        where: { userId },
      });

      if (deleted.count === 0) {
        return { message: 'No cart items found to delete.' };
      }

      console.log(`Deleted ${deleted.count} cart items for userId: ${userId}`);
      return { message: 'Cart items deleted successfully.' };
    } catch (err) {
      console.error('Error deleting cart items:', err.message);
      throw new Error('Failed to delete cart items.');
    }
  }
}
