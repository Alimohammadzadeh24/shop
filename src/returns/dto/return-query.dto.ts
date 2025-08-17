import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ReturnStatusEnum } from '../../common/enums/return-status.enum';

export class ReturnQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional({ enum: ReturnStatusEnum })
  @IsEnum(ReturnStatusEnum)
  @IsOptional()
  status?: ReturnStatusEnum;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  take?: number;
}
