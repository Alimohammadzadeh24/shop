import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from '../domain/user.model';
import { UserMapper } from '../domain/mappers/user.mapper';
import { UsersRepository } from './users.repository';
import { generateId } from '../common/utils/id';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<UserModel> {
    const model = UserMapper.fromCreateDto(dto);
    return this.repo.create({
      email: model.email,
      password: model.password,
      firstName: model.firstName,
      lastName: model.lastName,
      role: model.role as any,
      isActive: model.isActive,
    } as any);
  }

  async findOne(id: string): Promise<UserModel | undefined> {
    return this.repo.findById(id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserModel | undefined> {
    const existing = await this.repo.findById(id);
    if (!existing) return undefined;
    const updated = UserMapper.applyUpdate(existing, dto);
    return this.repo.update(id, {
      email: updated.email,
      password: updated.password,
      firstName: updated.firstName,
      lastName: updated.lastName,
      role: updated.role as any,
      isActive: updated.isActive,
    } as any);
  }

  async remove(id: string): Promise<boolean> {
    return this.repo.remove(id);
  }
}
