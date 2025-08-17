import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  async create(_dto: CreateProductDto): Promise<unknown> {
    return {};
  }

  async findAll(_query: ProductQueryDto): Promise<unknown> {
    return {};
  }

  async findOne(_id: string): Promise<unknown> {
    return {};
  }

  async update(_id: string, _dto: UpdateProductDto): Promise<unknown> {
    return {};
  }

  async remove(_id: string): Promise<unknown> {
    return {};
  }
}
