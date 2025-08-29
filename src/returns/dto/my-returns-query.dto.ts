import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ReturnStatusEnum } from '../../common/enums/return-status.enum';
import { Type } from 'class-transformer';

export class MyReturnsQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional({ enum: ReturnStatusEnum })
  @IsEnum(ReturnStatusEnum)
  @IsOptional()
  status?: ReturnStatusEnum;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  take?: number;
}
