import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { ReturnQueryDto } from './dto/return-query.dto';

@ApiTags('returns')
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  create(@Body() _dto: CreateReturnDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Get()
  findAll(@Query() _query: ReturnQueryDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Get(':id')
  findOne(@Param('id') _id: string): Promise<unknown> {
    return Promise.resolve({});
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') _id: string,
    @Body() _dto: UpdateReturnStatusDto,
  ): Promise<unknown> {
    return Promise.resolve({});
  }
}
