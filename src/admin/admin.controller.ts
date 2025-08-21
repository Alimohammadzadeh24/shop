import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminPanel } from '../common/decorators/admin-panel.decorator';
import { MinRole } from '../common/decorators/min-role.decorator';
import { RoleEnum } from '../common/enums/role.enum';

/**
 * Admin panel controller demonstrating the 4-tier role system.
 * Contains endpoints with different permission levels.
 */
@ApiTags('admin-panel')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  @Get('dashboard')
  @AdminPanel()
  @ApiOperation({
    summary: 'Get admin dashboard data',
    description:
      'Access admin dashboard. Available to ADMIN, PRIMARY, and SECONDARY roles. Users with USER role cannot access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    example: {
      totalUsers: 1250,
      totalOrders: 3456,
      totalProducts: 789,
      lowStockItems: 23,
    },
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token required',
  })
  @ApiForbiddenResponse({
    description:
      'Admin panel access required. Frontend users cannot access this endpoint.',
  })
  getDashboard() {
    return {
      message:
        'Admin dashboard accessible to ADMIN, PRIMARY, and SECONDARY roles',
      data: {
        totalUsers: 1250,
        totalOrders: 3456,
        totalProducts: 789,
        lowStockItems: 23,
      },
    };
  }

  @Get('reports')
  @MinRole(RoleEnum.PRIMARY)
  @ApiOperation({
    summary: 'Generate system reports',
    description:
      'Access to system reports. Requires PRIMARY or ADMIN role. SECONDARY and USER roles cannot access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports data retrieved successfully',
  })
  @ApiForbiddenResponse({
    description: "Minimum role 'PRIMARY' required.",
  })
  getReports() {
    return {
      message: 'Reports accessible to PRIMARY and ADMIN roles only',
      data: {
        salesReport: 'sales_data.pdf',
        userReport: 'user_analytics.pdf',
        inventoryReport: 'inventory_summary.pdf',
      },
    };
  }

  @Post('system/backup')
  @MinRole(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Create system backup',
    description:
      'Initiate system backup. Requires ADMIN role only. All other roles are denied access.',
  })
  @ApiResponse({
    status: 202,
    description: 'Backup process initiated',
  })
  @ApiForbiddenResponse({
    description: "Minimum role 'ADMIN' required.",
  })
  createBackup() {
    return {
      message: 'System backup accessible to ADMIN role only',
      data: {
        backupId: 'backup_20240115_143022',
        status: 'initiated',
        estimatedCompletion: '2024-01-15T15:00:00Z',
      },
    };
  }

  @Delete('users/:id')
  @MinRole(RoleEnum.PRIMARY)
  @ApiOperation({
    summary: 'Delete user account',
    description:
      'Permanently delete a user account. Requires PRIMARY or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to delete',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiForbiddenResponse({
    description: "Minimum role 'PRIMARY' required.",
  })
  deleteUser(@Param('id') id: string) {
    return {
      message: `User deletion (${id}) accessible to PRIMARY and ADMIN roles`,
      data: {
        deletedUserId: id,
        deletedAt: new Date().toISOString(),
      },
    };
  }

  @Get('settings')
  @AdminPanel()
  @ApiOperation({
    summary: 'Get admin settings',
    description:
      'View admin panel settings. Available to all admin panel users (ADMIN, PRIMARY, SECONDARY).',
  })
  @ApiResponse({
    status: 200,
    description: 'Settings retrieved successfully',
  })
  getSettings() {
    return {
      message: 'Settings accessible to all admin panel roles',
      data: {
        systemSettings: {
          maintenanceMode: false,
          maxUploadSize: '10MB',
          sessionTimeout: '24h',
        },
        userSettings: {
          allowRegistration: true,
          emailVerificationRequired: false,
          defaultRole: 'USER',
        },
      },
    };
  }

  @Post('moderate/product/:id')
  @AdminPanel()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Moderate product content',
    description:
      'Moderate product listings. Available to all admin panel users for content moderation.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID to moderate',
    example: 'clx1b2c3d4e5f6g7h8i9j0k2',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['approve', 'reject', 'flag'] },
        reason: { type: 'string' },
      },
      required: ['action'],
    },
    examples: {
      approve: {
        summary: 'Approve product',
        value: {
          action: 'approve',
          reason: 'Content meets guidelines',
        },
      },
      reject: {
        summary: 'Reject product',
        value: {
          action: 'reject',
          reason: 'Inappropriate content detected',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product moderation completed',
  })
  moderateProduct(@Param('id') id: string, @Body() body: any) {
    return {
      message: `Product moderation (${id}) accessible to all admin panel roles`,
      data: {
        productId: id,
        action: body.action,
        moderatedBy: 'current-user-id',
        moderatedAt: new Date().toISOString(),
      },
    };
  }
}
