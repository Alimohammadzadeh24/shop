import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateReturnDto {
  @ApiProperty()
  @IsString()
  orderId!: string;

  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsString()
  reason!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  refundAmount!: number;
}
