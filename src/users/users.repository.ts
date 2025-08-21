import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserModel } from '../domain/user.model';

function mapDbToModel(row: any): UserModel {
  return {
    id: row.id,
    email: row.email,
    password: row.password,
    firstName: row.firstName,
    lastName: row.lastName,
    role: row.role,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<UserModel> {
    const created = await this.prisma.user.create({
      data,
    });
    return mapDbToModel(created);
  }

  async findById(id: string): Promise<UserModel | undefined> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? mapDbToModel(row) : undefined;
  }

  async findByEmail(email: string): Promise<UserModel | undefined> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? mapDbToModel(row) : undefined;
  }

  async update(
    id: string,
    data: Partial<UserModel>,
  ): Promise<UserModel | undefined> {
    const updated = await this.prisma.user.update({ where: { id }, data });
    return updated ? mapDbToModel(updated) : undefined;
  }

  async remove(id: string): Promise<boolean> {
    await this.prisma.user.delete({ where: { id } });
    return true;
  }
}
