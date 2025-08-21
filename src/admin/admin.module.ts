import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

/**
 * Admin module providing admin panel functionality with role-based access control.
 * Demonstrates the 4-tier role system implementation.
 */
@Module({
  controllers: [AdminController],
  providers: [],
  exports: [],
})
export class AdminModule {}
