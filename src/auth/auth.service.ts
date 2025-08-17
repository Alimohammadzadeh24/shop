import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  async login(_dto: LoginDto): Promise<unknown> {
    return {};
  }

  async register(_dto: RegisterDto): Promise<unknown> {
    return {};
  }

  async changePassword(_dto: ChangePasswordDto): Promise<unknown> {
    return {};
  }

  async forgotPassword(_dto: ForgotPasswordDto): Promise<unknown> {
    return {};
  }
}
