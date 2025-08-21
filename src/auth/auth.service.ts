import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthResponseDto, MessageResponseDto } from './dto/auth-response.dto';
import { UsersRepository } from '../users/users.repository';
import { UserMapper } from '../domain/mappers/user.mapper';
import { generateId } from '../common/utils/id';
import { RoleEnum } from '../common/enums/role.enum';

/**
 * Service responsible for handling authentication operations including login, registration,
 * password management, and JWT token generation.
 *
 * @class AuthService
 * @since 1.0.0
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user with email and password, returning JWT tokens and user information.
   *
   * @async
   * @function login
   * @param {LoginDto} dto - Login credentials containing email and password
   * @returns {Promise<AuthResponseDto>} Authentication response with tokens and user data
   * @throws {UnauthorizedException} When credentials are invalid or account is deactivated
   *
   * @example
   * ```typescript
   * const result = await authService.login({
   *   email: 'user@example.com',
   *   password: 'securePassword123'
   * });
   * console.log(result.accessToken); // JWT access token
   * ```
   *
   * @since 1.0.0
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  /**
   * Registers a new user account with email, password, and profile information.
   * Automatically generates JWT tokens upon successful registration.
   *
   * @async
   * @function register
   * @param {RegisterDto} dto - Registration data including email, password, and profile info
   * @returns {Promise<AuthResponseDto>} Authentication response with tokens and user data
   * @throws {ConflictException} When email address is already registered
   *
   * @example
   * ```typescript
   * const result = await authService.register({
   *   email: 'newuser@example.com',
   *   password: 'securePassword123',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   role: RoleEnum.USER
   * });
   * console.log(result.user.id); // New user ID
   * ```
   *
   * @since 1.0.0
   */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.usersRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role ?? RoleEnum.USER,
      isActive: true,
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  /**
   * Changes the password for an authenticated user after validating the current password.
   * Requires the user to provide their current password for security verification.
   *
   * @async
   * @function changePassword
   * @param {ChangePasswordDto} dto - Password change data with current and new passwords
   * @param {string} userId - ID of the authenticated user requesting password change
   * @returns {Promise<MessageResponseDto>} Success message confirming password change
   * @throws {NotFoundException} When user is not found
   * @throws {BadRequestException} When current password is incorrect or same as new password
   *
   * @example
   * ```typescript
   * const result = await authService.changePassword({
   *   currentPassword: 'oldPassword123',
   *   newPassword: 'newSecurePassword456'
   * }, 'user-id-123');
   * console.log(result.message); // "Password changed successfully"
   * ```
   *
   * @since 1.0.0
   */
  async changePassword(
    dto: ChangePasswordDto,
    userId: string,
  ): Promise<MessageResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, saltRounds);

    await this.usersRepository.update(userId, {
      password: hashedNewPassword,
    });

    return {
      message: 'Password changed successfully',
    };
  }

  /**
   * Handles password reset requests by email. For security reasons, always returns
   * the same response regardless of whether the email exists in the system.
   *
   * @async
   * @function forgotPassword
   * @param {ForgotPasswordDto} dto - Password reset request containing email address
   * @returns {Promise<MessageResponseDto>} Generic success message for security
   *
   * @example
   * ```typescript
   * const result = await authService.forgotPassword({
   *   email: 'user@example.com'
   * });
   * console.log(result.message); // Generic success message
   * ```
   *
   * @todo Implement email sending functionality with reset tokens
   * @see {@link https://nodemailer.com/} for email implementation
   *
   * @since 1.0.0
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<MessageResponseDto> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      // Don't reveal if email exists or not for security reasons
      return {
        message:
          'If the email exists, password reset instructions have been sent',
      };
    }

    // TODO: Implement email sending logic here
    // For now, we'll just return a success message
    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Store it in the database with expiration
    // 3. Send an email with reset link containing the token

    console.log(`Password reset requested for email: ${dto.email}`);

    return {
      message:
        'If the email exists, password reset instructions have been sent',
    };
  }
}
