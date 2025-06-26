import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../auth/dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProductDto } from '../auth/dto/update-product.dto';
import { AddToCartDto } from '../auth/dto/cartItem.dto';

@Injectable()
export class CreateService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(
    createProduct: CreateProductDto,
  ): Promise<{ message: string }> {
    const { name, description, price, imageUrl, stock, category, ByUser } =
      createProduct;

    await this.prismaService.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        stock,
        category,
        ByUser,
      },
    });

    return { message: 'Product created successfully' };
  }

  async findAll() {
    const products = await this.prismaService.product.findMany();
    console.log('Fetched Products:', products);
    return products;
  }

  async seeProduct(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prismaService.product.update({
      where: { id },
      data: {
        viewsPerDay: product.viewsPerDay + 1,
        viewsPerWeek: product.viewsPerWeek + 1,
        viewsPerMonth: product.viewsPerMonth + 1,
      },
    });

    return product;
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    await this.prismaService.product.delete({
      where: { id },
    });

    return { message: 'Product successfully deleted' };
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<{ message: string }> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prismaService.product.update({
      where: { id },
      data: {
        ...updateProductDto,
      },
    });

    return { message: 'Product successfully updated' };
  }

  async searchProduct(query: string) {
    await this.prismaService.product.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }
}
