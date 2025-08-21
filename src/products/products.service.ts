import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductModel } from '../domain/product.model';
import { ProductMapper } from '../domain/mappers/product.mapper';
import { ProductsRepository } from './products.repository';

/**
 * Service responsible for managing product operations including creation, retrieval,
 * updating, and deletion of products in the catalog.
 *
 * @class ProductsService
 * @since 1.0.0
 */
@Injectable()
export class ProductsService {
  constructor(private readonly repo: ProductsRepository) {}

  /**
   * Creates a new product in the catalog with the provided information.
   *
   * @async
   * @function create
   * @param {CreateProductDto} dto - Product creation data including name, price, and details
   * @returns {Promise<ProductModel>} The created product model
   * @throws {ValidationException} When product data is invalid
   *
   * @example
   * ```typescript
   * const product = await productsService.create({
   *   name: 'Wireless Headphones',
   *   description: 'High-quality wireless headphones',
   *   price: 299.99,
   *   category: 'Electronics',
   *   brand: 'TechBrand',
   *   images: ['image1.jpg'],
   *   isActive: true
   * });
   * console.log(product.id); // Generated product ID
   * ```
   *
   * @since 1.0.0
   */
  async create(dto: CreateProductDto): Promise<ProductModel> {
    const model = ProductMapper.fromCreateDto(dto);
    const created = await this.repo.create({
      name: model.name,
      description: model.description,
      price: model.price,
      category: model.category,
      brand: model.brand,
      images: model.images,
      isActive: model.isActive,
    });
    return created;
  }

  /**
   * Retrieves products with optional filtering by search term, category, brand,
   * and pagination support.
   *
   * @async
   * @function findAll
   * @param {ProductQueryDto} query - Query parameters for filtering and pagination
   * @returns {Promise<ProductModel[]>} Array of product models matching the criteria
   *
   * @example
   * ```typescript
   * const products = await productsService.findAll({
   *   search: 'wireless',
   *   category: 'Electronics',
   *   skip: 0,
   *   take: 10
   * });
   * console.log(products.length); // Number of products found
   * ```
   *
   * @since 1.0.0
   */
  async findAll(query: ProductQueryDto): Promise<ProductModel[]> {
    return this.repo.findAll(query);
  }

  /**
   * Retrieves a product by its unique identifier.
   *
   * @async
   * @function findOne
   * @param {string} id - The unique identifier of the product
   * @returns {Promise<ProductModel | undefined>} The product model if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const product = await productsService.findOne('product-id-123');
   * if (product) {
   *   console.log(product.name); // Product name
   * }
   * ```
   *
   * @since 1.0.0
   */
  async findOne(id: string): Promise<ProductModel | undefined> {
    return this.repo.findById(id);
  }

  /**
   * Updates an existing product with the provided information. Only fields included
   * in the DTO will be updated, other fields remain unchanged.
   *
   * @async
   * @function update
   * @param {string} id - The unique identifier of the product to update
   * @param {UpdateProductDto} dto - Partial product data to update
   * @returns {Promise<ProductModel | undefined>} The updated product model if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const updatedProduct = await productsService.update('product-id-123', {
   *   price: 249.99,
   *   isActive: false
   * });
   * ```
   *
   * @since 1.0.0
   */
  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductModel | undefined> {
    const existing = await this.repo.findById(id);
    if (!existing) return undefined;
    const updated = ProductMapper.applyUpdate(existing, dto);
    return this.repo.update(id, {
      name: updated.name,
      description: updated.description,
      price: updated.price,
      category: updated.category,
      brand: updated.brand,
      images: updated.images,
      isActive: updated.isActive,
    });
  }

  /**
   * Permanently removes a product from the catalog. This operation cannot be undone.
   *
   * @async
   * @function remove
   * @param {string} id - The unique identifier of the product to remove
   * @returns {Promise<boolean>} True if product was successfully removed, false if not found
   *
   * @example
   * ```typescript
   * const wasRemoved = await productsService.remove('product-id-123');
   * if (wasRemoved) {
   *   console.log('Product successfully removed');
   * }
   * ```
   *
   * @warning This operation permanently deletes the product and cannot be undone
   * @since 1.0.0
   */
  async remove(id: string): Promise<boolean> {
    return this.repo.remove(id);
  }
}
