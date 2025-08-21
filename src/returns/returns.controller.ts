import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a return request',
    description:
      'Create a new return request for an order with reason and refund amount.',
  })
  @ApiBody({
    type: CreateReturnDto,
    description: 'Return request data',
    examples: {
      defectiveProduct: {
        summary: 'Defective product return',
        value: {
          orderId: 'clx1b2c3d4e5f6g7h8i9j0k1',
          userId: 'clx1b2c3d4e5f6g7h8i9j0k2',
          reason: 'Product arrived damaged and not working properly',
          refundAmount: 299.99,
        },
      },
      wrongSize: {
        summary: 'Wrong size return',
        value: {
          orderId: 'clx1b2c3d4e5f6g7h8i9j0k3',
          userId: 'clx1b2c3d4e5f6g7h8i9j0k4',
          reason: 'Product size does not fit as expected',
          refundAmount: 89.99,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Return request created successfully',
    type: ReturnResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    example: {
      statusCode: 400,
      message: [
        'orderId should not be empty',
        'userId should not be empty',
        'reason should not be empty',
        'refundAmount must be a positive number',
      ],
      error: 'Bad Request',
    },
  })
  async create(@Body() dto: CreateReturnDto): Promise<unknown> {
    const model = await this.returnsService.create(dto);
    return ReturnMapper.toResponseDto(model);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all returns',
    description:
      'Retrieve return requests with optional filtering by user, order, or status. Supports pagination.',
  })
  @ApiQuery({
    name: 'userId',
    description: 'Filter returns by user ID',
    required: false,
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiQuery({
    name: 'orderId',
    description: 'Filter returns by order ID',
    required: false,
    example: 'clx1b2c3d4e5f6g7h8i9j0k2',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter returns by status',
    required: false,
    example: 'REQUESTED',
  })
  @ApiQuery({
    name: 'skip',
    description: 'Number of returns to skip for pagination',
    required: false,
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    description: 'Number of returns to return (max 50)',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiOkResponse({
    description: 'Returns retrieved successfully',
    type: [ReturnResponseDto],
  })
  async findAll(@Query() query: ReturnQueryDto): Promise<unknown> {
    const models = await this.returnsService.findAll(query);
    return models.map(ReturnMapper.toResponseDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get return by ID',
    description: 'Retrieve a specific return request by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Return request unique identifier',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiOkResponse({
    description: 'Return found successfully',
    type: ReturnResponseDto,
    example: {
      id: 'clx1b2c3d4e5f6g7h8i9j0k1',
      orderId: 'clx1b2c3d4e5f6g7h8i9j0k2',
      userId: 'clx1b2c3d4e5f6g7h8i9j0k3',
      reason: 'Product arrived damaged',
      status: 'REQUESTED',
      refundAmount: 299.99,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiNotFoundResponse({
    description: 'Return not found',
    example: {
      statusCode: 404,
      message: 'Return not found',
      error: 'Not Found',
    },
  })
  async findOne(@Param('id') id: string): Promise<unknown> {
    const model = await this.returnsService.findOne(id);
    return model ? ReturnMapper.toResponseDto(model) : {};
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update return status',
    description:
      'Update the status of a return request (e.g., approve, reject, complete).',
  })
  @ApiParam({
    name: 'id',
    description: 'Return request unique identifier',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiBody({
    type: UpdateReturnStatusDto,
    description: 'New return status',
    examples: {
      approve: {
        summary: 'Approve return request',
        value: {
          status: 'APPROVED',
        },
      },
      reject: {
        summary: 'Reject return request',
        value: {
          status: 'REJECTED',
        },
      },
      complete: {
        summary: 'Complete return process',
        value: {
          status: 'COMPLETED',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Return status updated successfully',
    type: ReturnResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Return not found',
    example: {
      statusCode: 404,
      message: 'Return not found',
      error: 'Not Found',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid status transition',
    example: {
      statusCode: 400,
      message: 'Invalid status transition',
      error: 'Bad Request',
    },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReturnStatusDto,
  ): Promise<unknown> {
    const model = await this.returnsService.updateStatus(id, dto);
    return model ? ReturnMapper.toResponseDto(model) : {};
  }
}
