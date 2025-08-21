import { Injectable } from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { ReturnQueryDto } from './dto/return-query.dto';
import { ReturnModel } from '../domain/return.model';
import { ReturnMapper } from '../domain/mappers/return.mapper';
import { ReturnStatusEnum } from '../common/enums/return-status.enum';
import { ReturnsRepository } from './returns.repository';

@Injectable()
export class ReturnsService {
  constructor(private readonly repo: ReturnsRepository) {}

  async create(dto: CreateReturnDto): Promise<ReturnModel> {
    const model = ReturnMapper.fromCreateDto(dto);
    return this.repo.create({
      orderId: model.orderId,
      userId: model.userId,
      reason: model.reason,
      status: model.status as any,
      refundAmount: model.refundAmount,
    } as any);
  }

  async findAll(query: ReturnQueryDto): Promise<ReturnModel[]> {
    return this.repo.findAll(query);
  }

  async findOne(id: string): Promise<ReturnModel | undefined> {
    return this.repo.findById(id);
  }

  async updateStatus(
    id: string,
    dto: UpdateReturnStatusDto,
  ): Promise<ReturnModel | undefined> {
    return this.repo.updateStatus(id, dto.status as unknown as string);
  }
}
