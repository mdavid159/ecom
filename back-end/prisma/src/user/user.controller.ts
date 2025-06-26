import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('id-by-email')
  async getUserIdByEmail(
    @Body('email') email: string,
  ): Promise<{ userId: string }> {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const userId = await this.userService.findUserIdByEmail(email);

    if (!userId) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return { userId };
  }
  @Post('name-by-email')
  async getNameByEmail(
    @Body('email') email: string,
  ): Promise<{ name: string }> {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const name = await this.userService.findNameByEmail(email);

    if (!name) {
      throw new HttpException('Name not found', HttpStatus.NOT_FOUND);
    }

    return { name };
  }
}
