import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
//define a test suite with a describe fucntion, the test named PermissionController
describe('PermissionController', () => {
  let controller: PermissionController;//declare varibale named controller to hold an instance of the PermissionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({//sets up a testing module for the PermissionController. 
      controllers: [PermissionController],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
  });

  it('should be defined', () => { //defines each individual test case
    expect(controller).toBeDefined();
  });
});
