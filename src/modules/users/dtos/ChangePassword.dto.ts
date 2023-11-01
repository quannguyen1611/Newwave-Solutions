import { ApiProperty } from "@nestjs/swagger";
import { IUser } from "../users.interface";
import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({
        description: 'The old password of a user',
        required: true,
    })
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty({
        description: 'The new password of a user',
        required: true,
    })
    @IsNotEmpty()
    newPassword: string;
}