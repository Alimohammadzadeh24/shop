import { ReturnModel } from '../return.model';
import { CreateReturnDto } from '../../returns/dto/create-return.dto';
import { ReturnResponseDto } from '../../returns/dto/return-response.dto';
import { ReturnStatusEnum } from '../../common/enums/return-status.enum';

export class ReturnMapper {
  static fromCreateDto(dto: CreateReturnDto, userId: string): ReturnModel {
    const now = new Date();
    return {
      id: '',
      orderId: dto.orderId,
      userId: userId,
      reason: dto.reason,
      status: ReturnStatusEnum.REQUESTED,
      refundAmount: dto.refundAmount,
      createdAt: now,
      updatedAt: now,
    };
  }

  static toResponseDto(model: ReturnModel): ReturnResponseDto {
    return {
      id: model.id,
      orderId: model.orderId,
      userId: model.userId,
      reason: model.reason,
      status: model.status,
      refundAmount: model.refundAmount,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
