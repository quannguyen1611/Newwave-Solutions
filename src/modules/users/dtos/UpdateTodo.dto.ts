import { ApiProperty } from "@nestjs/swagger";

export class UpdateTodoDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    item: string;
}