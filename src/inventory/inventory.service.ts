import { Injectable } from '@nestjs/common';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { InventoryModel } from '../domain/inventory.model';
import { InventoryRepository } from './inventory.repository';

/**
 * Service responsible for managing inventory operations including stock levels,
 * low stock alerts, and inventory updates for products.
 *
 * @class InventoryService
 * @since 1.0.0
 */
@Injectable()
export class InventoryService {
  constructor(private readonly repo: InventoryRepository) {}

  /**
   * Retrieves inventory information for all products with optional low stock filtering.
   * Useful for generating stock reports and identifying products that need restocking.
   *
   * @async
   * @function findAll
   * @param {InventoryQueryDto} query - Query parameters for filtering inventory items
   * @returns {Promise<InventoryModel[]>} Array of inventory models matching the criteria
   *
   * @example
   * ```typescript
   * const lowStockItems = await inventoryService.findAll({
   *   lowStock: true,
   *   skip: 0,
   *   take: 10
   * });
   * console.log(`Found ${lowStockItems.length} low stock items`);
   * ```
   *
   * @since 1.0.0
   */
  async findAll(query: InventoryQueryDto): Promise<InventoryModel[]> {
    return this.repo.findAll(query);
  }

  /**
   * Retrieves inventory information for a specific product including current stock
   * levels, minimum threshold, and low stock status.
   *
   * @async
   * @function findOne
   * @param {string} productId - The unique identifier of the product
   * @returns {Promise<InventoryModel | undefined>} The inventory model if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const inventory = await inventoryService.findOne('product-id-123');
   * if (inventory) {
   *   console.log(`Stock: ${inventory.quantity}`);
   *   console.log(`Min threshold: ${inventory.minThreshold}`);
   *   console.log(`Low stock: ${inventory.quantity < inventory.minThreshold}`);
   * }
   * ```
   *
   * @since 1.0.0
   */
  async findOne(productId: string): Promise<InventoryModel | undefined> {
    return this.repo.findByProductId(productId);
  }

  /**
   * Updates inventory levels for a specific product. Creates inventory record if it doesn't exist.
   * Automatically updates the last modified timestamp.
   *
   * @async
   * @function update
   * @param {string} productId - The unique identifier of the product
   * @param {UpdateInventoryDto} dto - Inventory update data including quantity and threshold
   * @returns {Promise<InventoryModel>} The updated or created inventory model
   *
   * @example
   * ```typescript
   * const updatedInventory = await inventoryService.update('product-id-123', {
   *   quantity: 100,
   *   minThreshold: 10
   * });
   * console.log(`New stock level: ${updatedInventory.quantity}`);
   * ```
   *
   * @since 1.0.0
   */
  async update(
    productId: string,
    dto: UpdateInventoryDto,
  ): Promise<InventoryModel> {
    return this.repo.upsert(productId, {
      quantity: dto.quantity,
      minThreshold: dto.minThreshold,
    });
  }
}
