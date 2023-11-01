import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({
        description: 'The email of a user',
        required: true,
    })
    @IsNotEmpty()
    email: string;
}