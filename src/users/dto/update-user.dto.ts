import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '../../common/enums/role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address (must be unique)',
    example: 'newemail@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'New password',
    example: 'newSecurePassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'Jane',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Smith',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User role in the system',
    enum: RoleEnum,
    example: RoleEnum.ADMIN,
  })
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;

  @ApiPropertyOptional({
    description: 'Whether the user account is active',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
