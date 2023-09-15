import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from 'src/modules/typeorm/entities/todo.entity';
import { TodosController } from './controllers/todos/todos.controller';
import { TodosService } from './services/todos/todos.service';


@Module({
    imports: [TypeOrmModule.forFeature([Todo])],
    controllers: [TodosController],
    providers: [TodosService],
})
export class TodosModule {}