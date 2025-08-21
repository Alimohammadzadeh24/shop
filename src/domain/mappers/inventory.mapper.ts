import { InventoryModel } from '../inventory.model';
import { InventoryAlertDto } from '../../inventory/dto/inventory-alert.dto';

export class InventoryMapper {
  static toAlertDto(model: InventoryModel): InventoryAlertDto {
    return {
      productId: model.productId,
      quantity: model.quantity,
      minThreshold: model.minThreshold,
    };
  }
}


