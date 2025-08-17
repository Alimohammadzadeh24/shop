import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateInventoryDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  quantity!: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  minThreshold?: number;
}
