import { ApiProperty } from "@nestjs/swagger";

export class CreateTodoDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    item: string;
}