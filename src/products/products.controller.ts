import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() _dto: CreateProductDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Get()
  findAll(@Query() _query: ProductQueryDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Get(':id')
  findOne(@Param('id') _id: string): Promise<unknown> {
    return Promise.resolve({});
  }

  @Patch(':id')
  update(
    @Param('id') _id: string,
    @Body() _dto: UpdateProductDto,
  ): Promise<unknown> {
    return Promise.resolve({});
  }

  @Delete(':id')
  remove(@Param('id') _id: string): Promise<unknown> {
    return Promise.resolve({});
  }
}
