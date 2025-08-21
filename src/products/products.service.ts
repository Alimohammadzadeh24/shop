import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductModel } from '../domain/product.model';
import { ProductMapper } from '../domain/mappers/product.mapper';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly repo: ProductsRepository) {}

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

  async findAll(query: ProductQueryDto): Promise<ProductModel[]> {
    return this.repo.findAll(query);
  }

  async findOne(id: string): Promise<ProductModel | undefined> {
    return this.repo.findById(id);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductModel | undefined> {
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

  async remove(id: string): Promise<boolean> {
    return this.repo.remove(id);
  }
}
