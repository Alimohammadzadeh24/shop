import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty({ type: [Object] })
  @IsArray()
  items!: Array<{ productId: string; quantity: number; unitPrice: number }>;

  @ApiProperty({ type: Object })
  shippingAddress!: Record<string, unknown>;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalAmount!: number;
}
