import { IsString } from 'class-validator';

export class ChangeNameDto {
  @IsString()
  newName: string;
  @IsString()
  password: string;
}
