import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductModel } from '../domain/product.model';
import { ProductQueryDto } from './dto/product-query.dto';

function mapDbToModel(row: any): ProductModel {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    brand: row.brand,
    images: row.images ?? [],
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: Omit<ProductModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductModel> {
    const created = await this.prisma.product.create({
      data: {
        name: model.name,
        description: model.description,
        price: model.price,
        category: model.category,
        brand: model.brand,
        images: model.images,
        isActive: model.isActive,
      },
    });
    return mapDbToModel(created);
  }

  async findAll(query: ProductQueryDto): Promise<ProductModel[]> {
    const where: any = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.category) where.category = query.category;
    if (query.brand) where.brand = query.brand;

    const rows = await this.prisma.product.findMany({
      where,
      skip: query.skip,
      take: query.take,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(mapDbToModel);
  }

  async findById(id: string): Promise<ProductModel | undefined> {
    const row = await this.prisma.product.findUnique({ where: { id } });
    return row ? mapDbToModel(row) : undefined;
  }

  async update(
    id: string,
    data: Partial<Omit<ProductModel, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ProductModel | undefined> {
    const updated = await this.prisma.product.update({
      where: { id },
      data,
    });
    return updated ? mapDbToModel(updated) : undefined;
  }

  async remove(id: string): Promise<boolean> {
    await this.prisma.product.delete({ where: { id } });
    return true;
  }
}


