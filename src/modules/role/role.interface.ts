import { EPermissions } from '../../shared/permission.enum';

export interface IRole {
  id?: number;
  name?: string;
  permissions?: EPermissions[];
  isAllPermission?: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

