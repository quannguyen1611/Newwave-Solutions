import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "src/modules/typeorm/entities/todo.entity";
import { CreateTodoParams, UpdateTodoParams} from "src/modules/utils/types";
import { Repository } from "typeorm";


@Injectable()
export class TodosService{
    constructor(
        @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    ){}

    createTodo(todoDetails: CreateTodoParams) {
        const newTodo = this.todoRepository.create({
            ...todoDetails, 
            createdAt: new Date(),
        });
        return this.todoRepository.save(newTodo);
    }

    updateTodo(id: number, updateTodoDetails: UpdateTodoParams){
        return this.todoRepository.update({id}, {...updateTodoDetails});
    }

    deleteTodo(id: number){
        return this.todoRepository.delete({id});
    }
}