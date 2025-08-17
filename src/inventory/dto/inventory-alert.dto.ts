import { ApiProperty } from '@nestjs/swagger';

export class InventoryAlertDto {
  @ApiProperty()
  productId!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  minThreshold!: number;
}
