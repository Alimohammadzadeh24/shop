import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() _dto: CreateUserDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Get(':id')
  findOne(@Param('id') _id: string): Promise<unknown> {
    return Promise.resolve({});
  }

  @Patch(':id')
  update(
    @Param('id') _id: string,
    @Body() _dto: UpdateUserDto,
  ): Promise<unknown> {
    return Promise.resolve({});
  }

  @Delete(':id')
  remove(@Param('id') _id: string): Promise<unknown> {
    return Promise.resolve({});
  }
}
