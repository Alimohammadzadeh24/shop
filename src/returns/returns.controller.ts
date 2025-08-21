import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { ReturnQueryDto } from './dto/return-query.dto';
import { ReturnMapper } from '../domain/mappers/return.mapper';
import { ReturnResponseDto } from './dto/return-response.dto';

@ApiTags('returns')
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @ApiCreatedResponse({ type: ReturnResponseDto })
  async create(@Body() dto: CreateReturnDto): Promise<unknown> {
    const model = await this.returnsService.create(dto);
    return ReturnMapper.toResponseDto(model);
  }

  @Get()
  @ApiOkResponse({ type: [ReturnResponseDto] })
  async findAll(@Query() query: ReturnQueryDto): Promise<unknown> {
    const models = await this.returnsService.findAll(query);
    return models.map(ReturnMapper.toResponseDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: ReturnResponseDto })
  async findOne(@Param('id') id: string): Promise<unknown> {
    const model = await this.returnsService.findOne(id);
    return model ? ReturnMapper.toResponseDto(model) : {};
  }

  @Patch(':id/status')
  @ApiOkResponse({ type: ReturnResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReturnStatusDto,
  ): Promise<unknown> {
    const model = await this.returnsService.updateStatus(id, dto);
    return model ? ReturnMapper.toResponseDto(model) : {};
  }
}
