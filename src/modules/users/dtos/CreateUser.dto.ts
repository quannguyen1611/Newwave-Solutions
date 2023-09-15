import { ApiProperty } from "@nestjs/swagger";
import { EUserStatus } from "../users.enum";
import { IsAlphanumeric, IsEmail, IsEnum, IsNotEmpty, Length } from "class-validator";
import { IUser } from "../users.interface";

export class CreateUserDto implements Partial<IUser> {
    @ApiProperty({
      description: 'The username of a user',
      required: true,
    })
    @IsAlphanumeric()
    @Length(2, 30)
    @IsNotEmpty()
    username: string;
  
    @ApiProperty({
      description: 'The email of a user',
      required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({
      description: 'The status of a user',
      required: true,
      default: EUserStatus.Active,
    })
    @IsEnum(EUserStatus)
    @IsNotEmpty()
    status: EUserStatus;
  
    @ApiProperty({
      description: 'The password of a user',
      required: true,
    })
    @IsNotEmpty()
    password: string;
  
    @ApiProperty({
      description: 'The roleIds of a user',
      required: false,
      example: [1,2],
    })
    roleIds?: number[];
  }