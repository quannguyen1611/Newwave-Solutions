import { ApiProperty } from "@nestjs/swagger";
import { IUser } from "../users.interface";
import { IsEnum, IsNotEmpty } from "class-validator";
import { EUserStatus } from "../users.enum";

export class UpdateUserDto implements Partial<IUser> {
    @ApiProperty({
        description: 'The username of a user',
        required: true,
        default: EUserStatus.InActive,
    })
    username: string;

    @ApiProperty({
      description: 'The status of a user',
      required: false,
      default: EUserStatus.InActive,
    })
    @IsEnum(EUserStatus)
    @IsNotEmpty()
    status?: EUserStatus;
  
    @ApiProperty({
      description: 'The password of a user',
      required: true,
    })
    password: string;
  
    @ApiProperty({
      description: 'The roleIds of a user',
      example: [1, 2, 3],
      required: false,
    })
    roleIds: number[];
  }