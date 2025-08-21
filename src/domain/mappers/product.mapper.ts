import { ProductModel } from '../product.model';
import { CreateProductDto } from '../../products/dto/create-product.dto';
import { UpdateProductDto } from '../../products/dto/update-product.dto';
import { ProductResponseDto } from '../../products/dto/product-response.dto';

export class ProductMapper {
  static fromCreateDto(dto: CreateProductDto): ProductModel {
    const now = new Date();
    return {
      id: '',
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      brand: dto.brand,
      images: dto.images,
      isActive: dto.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
  }

  static applyUpdate(model: ProductModel, dto: UpdateProductDto): ProductModel {
    return {
      ...model,
      ...dto,
      updatedAt: new Date(),
    };
  }

  static toResponseDto(model: ProductModel): ProductResponseDto {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      price: model.price,
      category: model.category,
      brand: model.brand,
      images: model.images,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}


