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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductMapper } from '../domain/mappers/product.mapper';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiCreatedResponse({ type: ProductResponseDto })
  async create(@Body() dto: CreateProductDto): Promise<unknown> {
    const model = await this.productsService.create(dto);
    return ProductMapper.toResponseDto(model);
  }

  @Get()
  @ApiOkResponse({ type: [ProductResponseDto] })
  async findAll(@Query() query: ProductQueryDto): Promise<unknown> {
    const models = await this.productsService.findAll(query);
    return models.map(ProductMapper.toResponseDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductResponseDto })
  async findOne(@Param('id') id: string): Promise<unknown> {
    const model = await this.productsService.findOne(id);
    return model ? ProductMapper.toResponseDto(model) : {};
  }

  @Patch(':id')
  @ApiOkResponse({ type: ProductResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<unknown> {
    const model = await this.productsService.update(id, dto);
    return model ? ProductMapper.toResponseDto(model) : {};
  }

  @Delete(':id')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { success: { type: 'boolean' } },
    },
  })
  async remove(@Param('id') id: string): Promise<unknown> {
    const ok = await this.productsService.remove(id);
    return { success: ok };
  }
}
