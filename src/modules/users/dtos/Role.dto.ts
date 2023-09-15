import { ApiProperty } from '@nestjs/swagger';
import { IRole } from '../../role/role.interface';
import {
  ArrayUnique,
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { IResponsePaging } from '../../../shared/shared.interface';
import { QueryPagingDto } from '../../../shared/shared.dto';
import { pick } from 'lodash';
import { EPermissions } from '../../../shared/permission.enum';

export class CreateRoleDto implements Partial<IRole> {
  @ApiProperty({
    description: 'The name of a role',
    required: true,
  })
  @IsAlphanumeric()
  @Length(2, 30)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The permissions of a role',
    required: false,
    type: [String],
    enum: Object.values(EPermissions),
  })
  @IsEnum(EPermissions, { each: true })
  @ArrayUnique()
  permissions?: EPermissions[];

  @ApiProperty({
    description: 'The isAllPermission of a role',
    required: true,
    default: false,
  })
  @IsNotEmpty()
  isAllPermission: boolean;
}

export class UpdateRoleDto implements Partial<IRole> {
  @ApiProperty({
    description: 'The name of a role',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The permissions of a role',
    required: false,
    type: [String],
    enum: Object.values(EPermissions),
  })
  @IsEnum(EPermissions, { each: true })
  @ArrayUnique()
  permissions?: EPermissions[];

  @ApiProperty({
    description: 'The isAllPermission of a role',
    required: true,
    default: false,
  })
  @IsNotEmpty()
  isAllPermission: boolean;
}

export class ResponseRoleDto implements Partial<IRole> {
  @ApiProperty({
    description: 'The id of a role',
    required: false,
  })
  id?: number;

  @ApiProperty({
    description: 'The name of a role',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The permissions of a role',
    required: false,
  })
  permission?: string;

  @ApiProperty({
    description: 'The permissions of a role',
    required: false,
  })
  permissions?: EPermissions[];

  constructor(init?: Partial<ResponseRoleDto>) {
    Object.assign(
      this,
      pick(init, [
        'id',
        'name',
        'permissions',
        'isAllPermission',
        'created_at',
        'updated_at',
        'deleted_at',
      ]),
    );
  }

  @ApiProperty({
    description: 'The created_at of a role',
    required: false,
  })
  created_at?: Date;

  @ApiProperty({
    description: 'The updated_at of a role',
    required: false,
  })
  updated_at?: Date;

  @ApiProperty({
    description: 'The deleted_at of a role',
    required: false,
  })
  deleted_at?: Date;

  @ApiProperty({
    description: 'The isAllPermission of a role',
    required: true,
  })
  isAllPermission?: boolean;
}

export class ResponseRolePagingDto implements IResponsePaging<ResponseRoleDto> {
  @ApiProperty({
    description: 'The result of a list response',
    required: false,
  })
  result: ResponseRoleDto[];

  @ApiProperty({
    description: 'The total of a list response',
    required: false,
  })
  total: number;

  @ApiProperty({
    description: 'The total pages of a list response',
    required: false,
  })
  totalPages: number;
}

export class QueryRoleDto extends QueryPagingDto {
  @ApiProperty({
    name: 'q',
    required: false,
  })
  q: string;

  @ApiProperty({
    name: 'page',
    required: false,
    default: 1,
  })
  page: number;

  @ApiProperty({
    name: 'perPage',
    required: false,
    default: 10,
  })
  perPage: number;
}

export class DeleteRoleDto {
  @ApiProperty({
    name: 'ids',
    required: false,
    type: [Number],
  })
  ids: number[];
}
