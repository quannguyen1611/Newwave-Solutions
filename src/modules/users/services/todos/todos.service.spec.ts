import {Test, TestingModule} from '@nestjs/testing';
import { TodosService } from './todos.service';

describe ('UsersService', () => {
    let service: TodosService

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TodosService],
        }).compile();

        service = module.get<TodosService>(TodosService);
    });

    it('Should be defined', () => {
        expect(service).toBeDefined();
    });
});