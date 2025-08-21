import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from '../domain/mappers/user.mapper';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserResponseDto })
  async create(@Body() dto: CreateUserDto): Promise<unknown> {
    const model = await this.usersService.create(dto);
    return UserMapper.toResponseDto(model);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  async findOne(@Param('id') id: string): Promise<unknown> {
    const model = await this.usersService.findOne(id);
    return model ? UserMapper.toResponseDto(model) : {};
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<unknown> {
    const model = await this.usersService.update(id, dto);
    return model ? UserMapper.toResponseDto(model) : {};
  }

  @Delete(':id')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { success: { type: 'boolean' } },
    },
  })
  async remove(@Param('id') id: string): Promise<unknown> {
    const ok = await this.usersService.remove(id);
    return { success: ok };
  }
}
