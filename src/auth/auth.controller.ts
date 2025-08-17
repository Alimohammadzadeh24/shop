import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and issue tokens' })
  login(@Body() _dto: LoginDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() _dto: RegisterDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  changePassword(@Body() _dto: ChangePasswordDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password reset instructions' })
  forgotPassword(@Body() _dto: ForgotPasswordDto): Promise<unknown> {
    return Promise.resolve({});
  }
}
