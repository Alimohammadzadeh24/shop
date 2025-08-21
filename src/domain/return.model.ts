import { ReturnStatusEnum } from '../common/enums/return-status.enum';

export class ReturnModel {
  id!: string;
  orderId!: string;
  userId!: string;
  reason!: string;
  status!: ReturnStatusEnum;
  refundAmount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}


