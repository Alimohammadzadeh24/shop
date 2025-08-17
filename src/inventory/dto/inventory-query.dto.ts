import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class InventoryQueryDto {
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
