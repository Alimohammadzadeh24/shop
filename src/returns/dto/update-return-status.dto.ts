import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReturnStatusEnum } from '../../common/enums/return-status.enum';

export class UpdateReturnStatusDto {
  @ApiProperty({ enum: ReturnStatusEnum })
  @IsEnum(ReturnStatusEnum)
  status!: ReturnStatusEnum;
}
