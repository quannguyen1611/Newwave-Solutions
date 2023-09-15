import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    Length,
  } from 'class-validator';
  import { IUser } from '../users.interface';
  import { IResponsePaging } from '../../../shared/shared.interface';
  import { ApiProperty } from '@nestjs/swagger';
  import { pick } from 'lodash';
  import { ResponseRoleDto } from './Role.dto';
  import { EUserStatus } from '../users.enum';
  import { QueryPagingDto } from '../../../shared/shared.dto';
  
  // export class CreateUserDto implements Partial<IUser> {
  //   @ApiProperty({
  //     description: 'The username of a user',
  //     required: true,
  //   })
  //   @IsAlphanumeric()
  //   @Length(2, 30)
  //   @IsNotEmpty()
  //   username: string;
  
  //   @ApiProperty({
  //     description: 'The email of a user',
  //     required: true,
  //   })
  //   @IsEmail()
  //   @IsNotEmpty()
  //   email: string;
  
  //   @ApiProperty({
  //     description: 'The status of a user',
  //     required: true,
  //     default: EUserStatus.Active,
  //   })
  //   @IsEnum(EUserStatus)
  //   @IsNotEmpty()
  //   status: EUserStatus;
  
  //   @ApiProperty({
  //     description: 'The password of a user',
  //     required: true,
  //   })
  //   @IsNotEmpty()
  //   password: string;
  
  //   @ApiProperty({
  //     description: 'The roleIds of a user',
  //     example: [1, 2, 3],
  //     required: false,
  //   })
  //   roleIds?: number[];
  // }
  
  // export class UpdateUserDto implements Partial<IUser> {
  //   @ApiProperty({
  //     description: 'The status of a user',
  //     required: false,
  //     default: EUserStatus.InActive,
  //   })
  //   @IsEnum(EUserStatus)
  //   @IsNotEmpty()
  //   status?: EUserStatus;
  
  //   @ApiProperty({
  //     description: 'The password of a user',
  //     required: false,
  //   })
  //   password?: string;
  
  //   @ApiProperty({
  //     description: 'The roleIds of a user',
  //     example: [1, 2, 3],
  //     required: false,
  //   })
  //   roleIds: number[];
  // }
  
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
  
  