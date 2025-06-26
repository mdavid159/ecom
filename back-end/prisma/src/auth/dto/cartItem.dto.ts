import { IsInt, IsPositive, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsInt()
  productId: number;

  @IsPositive()
  price: number;

  @IsString()
  imageUrl: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
