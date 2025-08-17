import { Injectable } from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { ReturnQueryDto } from './dto/return-query.dto';

@Injectable()
export class ReturnsService {
  async create(_dto: CreateReturnDto): Promise<unknown> {
    return {};
  }

  async findAll(_query: ReturnQueryDto): Promise<unknown> {
    return {};
  }

  async findOne(_id: string): Promise<unknown> {
    return {};
  }

  async updateStatus(
    _id: string,
    _dto: UpdateReturnStatusDto,
  ): Promise<unknown> {
    return {};
  }
}
