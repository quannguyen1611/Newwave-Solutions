import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "src/guard/access-token.guard";
import { PermissionGuard } from "src/guard/permission.guard";
import { CreateTodoDto } from "src/modules/users/dtos/CreateTodo.dto";
import { UpdateTodoDto } from "src/modules/users/dtos/UpdateTodo.dto";
import { TodosService } from "src/modules/users/services/todos/todos.service";

@ApiTags('todos')
@Controller('todos')
export class TodosController {
    constructor(private todoService: TodosService) {}

    @Post()
    @ApiOperation({ summary: 'Create todo' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    createTodo(@Body() createTodoDto: CreateTodoDto) {
        return this.todoService.createTodo(createTodoDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update todo' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async updateTodorById(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTodoDto: UpdateTodoDto,
    ) {
        await this.todoService.updateTodo(id, updateTodoDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete todo' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async deleteTodoById(@Param('id', ParseIntPipe) id: number){
        await this.todoService.deleteTodo(id);
    }

}