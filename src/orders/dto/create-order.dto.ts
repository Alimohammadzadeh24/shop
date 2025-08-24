import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsObject,
  Min,
  IsNotEmptyObject,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ type: [Object] })
  @IsArray()
  items!: Array<{ productId: string; quantity: number; unitPrice: number }>;

  @ApiProperty({ type: Object })
  @IsObject()
  @IsNotEmptyObject()
  shippingAddress!: Record<string, unknown>;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalAmount!: number;
}
