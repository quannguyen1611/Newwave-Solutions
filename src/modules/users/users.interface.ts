import { EUserStatus } from './users.enum';

export interface IUser {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly roleIds: number[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly status: EUserStatus;
  readonly lastPasswordChangedAt: Date;
}
