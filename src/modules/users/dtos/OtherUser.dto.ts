import {
    IsEnum,
    IsOptional,
  } from 'class-validator';
  import { IUser } from '../users.interface';
  import { IResponsePaging } from '../../../shared/shared.interface';
  import { ApiProperty } from '@nestjs/swagger';
  import { pick } from 'lodash';
  import { ResponseRoleDto } from './Role.dto';
  import { EUserStatus } from '../users.enum';
  import { QueryPagingDto } from '../../../shared/shared.dto';
  
  export class ResponseUserDto implements Partial<IUser> {
    constructor(init?: Partial<ResponseUserDto>) {
      Object.assign(
        this,
        pick(init, [
          'id',
          'username',
          'email',
          'roles',
          'created_at',
          'updated_at',
          'deleted_at',
          'password',
          'status',
          'type',
          'last_password_changed_at'
        ]),
      );
    }
  
    @ApiProperty({
      description: 'The id of a user',
      required: false,
    })
    id?: number;
  
    @ApiProperty({
      description: 'The username of a user',
      required: false,
    })
    username?: string;
  
    @ApiProperty({
      description: 'The email of a user',
      required: false,
    })
    email?: string;
  
    @ApiProperty({
      description: 'The password of a user',
      required: false,
    })
    password?: string;
  
    @ApiProperty({
      description: 'The roles of a user',
      required: false,
    })
    roles?: ResponseRoleDto[];

    @ApiProperty({
      description: 'The type of a user',
      required: false,
    })
    type?: string;
  
    @ApiProperty({
      description: 'The created_at of a user',
      required: false,
    })
    created_at?: Date;
  
    @ApiProperty({
      description: 'The updated_at of a user',
      required: false,
    })
    updated_at?: Date;
  
    @ApiProperty({
      description: 'The deleted_at of a user',
      required: false,
    })
    deleted_at?: Date;
  
    @ApiProperty({
      description: 'The status of a user',
      required: false,
    })
    status?: EUserStatus;

    @ApiProperty({
      description: 'The time when user last changed their password',
      required: false,
    })
    last_password_changed_at: Date;
  }
  
  export class ResponseUserPagingDto implements IResponsePaging<ResponseUserDto> {
    @ApiProperty({
      description: 'The result of a list response',
      required: false,
    })
    result: ResponseUserDto[];
  
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
  
  export class QueryUserDto extends QueryPagingDto {
    @ApiProperty({
      name: 'q',
      required: false,
    })
    q: string;
  
    @ApiProperty({
      description: 'The status of a user',
      required: false,
      default: EUserStatus.Active,
    })
    @IsEnum(EUserStatus)
    @IsOptional()
    status?: EUserStatus;
  
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
  
  