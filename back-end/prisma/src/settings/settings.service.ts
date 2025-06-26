import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeNameDto } from '../auth/dto/change-name.dto';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';

@Injectable()
export class SettingsService {
  constructor(private prismaService: PrismaService) {}

  async getStats(numId: number) {
    const id = Number(numId);
    const stats = await this.prismaService.product.findUnique({
      where: { id },
      select: {
        name: true,
        viewsPerDay: true,
        viewsPerWeek: true,
        viewsPerMonth: true,
        createdAt: true,
        lastViewsResetAt: true,
      },
    });

    if (!stats) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    const now = dayjs();
    const startOfDay = now.startOf('day');
    const startOfWeek = now.startOf('week');
    const startOfMonth = now.startOf('month');

    const lastReset = dayjs(stats.lastViewsResetAt);

    const updates: any = {};

    if (lastReset.isBefore(startOfDay)) updates.viewsPerDay = 0;
    if (lastReset.isBefore(startOfWeek)) updates.viewsPerWeek = 0;
    if (lastReset.isBefore(startOfMonth)) updates.viewsPerMonth = 0;
    console.log('Object keys:', Object.keys(updates));

    if (Object.keys(updates).length > 0) {
      updates.lastViewsResetAt = new Date();
      await this.prismaService.product.update({
        where: { id },
        data: updates,
      });
    }

    return {
      ...stats,
      ...updates,
    };
  }

  async getProducts(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
      select: { email: true },
    });

    if (!user) {
      throw new Error(`User with ID ${id} not found.`);
    }

    const products = await this.prismaService.product.findMany({
      where: { ByUser: user.email }, // Todo , recognition by userId is not optimal , change to email , do the frontend part too
    });

    return products;
  }

  async changeUserName(id: string, changeUserNameDto: ChangeNameDto) {
    const { newName, password } = changeUserNameDto;
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { name: true, passwordHash: true },
    });

    if (!user) {
      throw new Error(`User with ID ${id} not found.`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    } else {
      await this.prismaService.user.update({
        where: { id },
        data: { name: newName },
      });
      return { message: 'User name updated successfully.' };
    }
  }
}
