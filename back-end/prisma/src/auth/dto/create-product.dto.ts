import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;

  @IsString()
  category: string;

  @IsArray()
  @IsNotEmpty()
  imageUrl: string[];

  @IsString()
  ByUser: string;
}
