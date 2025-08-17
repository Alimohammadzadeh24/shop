import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  async create(_dto: CreateUserDto): Promise<unknown> {
    return {};
  }

  async findOne(_id: string): Promise<unknown> {
    return {};
  }

  async update(_id: string, _dto: UpdateUserDto): Promise<unknown> {
    return {};
  }

  async remove(_id: string): Promise<unknown> {
    return {};
  }
}
