import {
  IsOptional,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  category?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  imageUrl?: string[];
}
