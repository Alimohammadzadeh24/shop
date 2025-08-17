import { ApiProperty } from '@nestjs/swagger';
import { ReturnStatusEnum } from '../../common/enums/return-status.enum';

export class ReturnResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  reason!: string;

  @ApiProperty({ enum: ReturnStatusEnum })
  status!: ReturnStatusEnum;

  @ApiProperty()
  refundAmount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
