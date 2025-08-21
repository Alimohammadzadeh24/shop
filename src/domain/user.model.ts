import { RoleEnum } from '../common/enums/role.enum';

export class UserModel {
  id!: string;
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role!: RoleEnum;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}


