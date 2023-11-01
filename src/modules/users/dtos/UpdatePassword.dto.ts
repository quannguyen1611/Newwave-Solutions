import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty({
        description: 'The token of a user',
        required: true,
    })
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        description: 'The new password of a user',
        required: true,
    })
    @IsNotEmpty()
    newPassword: string;
}