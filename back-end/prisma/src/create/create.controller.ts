import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  Get,
  Param,
  Delete,
  Patch,
  Query,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { CreateService } from './create.service';
import { CreateProductDto } from '../auth/dto/create-product.dto';
import { AddToCartDto } from '../auth/dto/cartItem.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('product')
export class CreateController {
  constructor(
    private createService: CreateService,
    private prismaService: PrismaService,
  ) {}

  @Get()
  async getAllProducts(): Promise<any[]> {
    return await this.createService.findAll();
  }

  @Get('search')
  async searchProduct(@Query('query') query: string) {
    return this.createService.searchProduct(query);
  }

  @Post('uploads')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }

  @Post('create')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.createService.createProduct(createProductDto);
  }

  @Get(':id')
  seeProduct(@Param('id') id: string) {
    return this.createService.seeProduct(+id);
  }

  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    return this.createService.deleteProduct(+id);
  }

  @Patch('edit-product/:id')
  async editProduct(
    @Param('id') id: string,
    @Body() createProductDto: CreateProductDto,
  ): Promise<{ message: string }> {
    return this.createService.updateProduct(+id, createProductDto);
  }
}
