import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    OnModuleInit,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { RoleEntity } from '../typeorm/entities/role.entity';
  import { In, Like, Repository } from 'typeorm';
  import {
    CreateRoleDto,
    QueryRoleDto,
    ResponseRoleDto,
    ResponseRolePagingDto,
    UpdateRoleDto,
  } from '../users/dtos/Role.dto';
  import * as fs from 'fs';
  import { ModuleRef } from '@nestjs/core';
  import { UsersService } from '../users/services/users/users.service';
  
  @Injectable()
  export class RoleService implements OnModuleInit {
    private readonly logger = new Logger();
    private userService: UsersService;
    constructor(
      @InjectRepository(RoleEntity)
      private roleRepository: Repository<RoleEntity>,
      private moduleRef: ModuleRef,
    ) {}
  
    async onModuleInit() {
      this.userService = await this.moduleRef.get(UsersService, { strict: false });
    }
  
    async create(createRoleDto: CreateRoleDto): Promise<ResponseRoleDto> {
      const role = new RoleEntity();
      role.name = createRoleDto.name;
      role.permissions = createRoleDto.permissions;
      role.isAllPermission = createRoleDto.isAllPermission;
      await this.roleRepository.save(role);
  
      return this.transformData<ResponseRoleDto>(role);
    }
  
    async findOne(id: number = 0): Promise<ResponseRoleDto> {
      const role = await this.roleRepository.findOneBy({
        id,
      });
      if (!role) {
        throw new BadRequestException("The role's not found!");
      }
      return this.transformData<ResponseRoleDto>(role);
    }
  
    async findAll(queryRoleDto: QueryRoleDto): Promise<ResponseRolePagingDto> {
      // Extract properties from the 'queryRoleDto' object.  
      const { page, perPage, q } = queryRoleDto;
      // Use the TypeORM repository to query the database.
      // Find and count records in the 'roleRepository' table.
      const [result, total] = await this.roleRepository.findAndCount({
        //Specify the WHERE clause based on the 'q' property
        where: q ? { name: Like('%' + q + '%') } : {},
        //order the results by the 'updated_at' column in descending order
        order: { updated_at: 'DESC' },
        //Limit the number of records returned to 'perPgae'
        take: perPage,
        //Offset the records based on the current 'page'
        skip: (page - 1) * perPage,
      });
      //Returned the formatted result as a ResponseRolePagingDto object.
      return {
        //Transform the 'result' array usuing the 'transformData' method
        result: this.transformData<ResponseRoleDto[]>(result),
        total, //the total num of records found
        // calculate the total number of pages based on 'total' and 'perPage'
        totalPages: Math.floor((total + perPage - 1) / perPage),
      };
    }
  
    async updateOne(
      id: number = 0,
      updateRoleDto: UpdateRoleDto,
    ): Promise<ResponseRoleDto> {
      const role = await this.roleRepository.findOneBy({
        id,
      });
      if (!role) {
        throw new BadRequestException("Role not found!");
      }
      try {
        role.name = updateRoleDto.name;
        role.permissions = updateRoleDto.permissions;
        role.isAllPermission = updateRoleDto.isAllPermission;
        const updatedRole = await this.roleRepository.save(role);
        return this.transformData(updatedRole);
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException(
          "There's an error during updating role!",
        );
      }
    }
  
    async deleteOne(id: number = 0): Promise<void> {
      const role = await this.roleRepository.findOneBy({
        id,
      });
      if (!role) {
        throw new BadRequestException("Role not found!");
      }
      try {
        await this.roleRepository.softDelete({ id: id }); //use softDeelte for future data recovery
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }
    }
  
    async deleteMany(ids: number[]): Promise<void> {
      const roles = await this.roleRepository.find({
        where: { id: In(ids) },
      });
  
      if (roles.length !== ids.length) {
        throw new BadRequestException('Roles do not exist');
      }
  
      try {
        await this.roleRepository.softDelete({ id: In(ids) });
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }
    }

    //map database query results into a more structured response format.
    transformData<T>(data: any): T {
      if (Array.isArray(data)) {
        return data.map((item: T) => {
          const role = new ResponseRoleDto(item);
          return role as T;
        }) as T;
      } else {
        const role = new ResponseRoleDto(data);
        return role as T;
      }
    }
  
    getPermissions() {
      try {
        const data = fs.readFileSync('../../permission.json', 'utf8');
        return JSON.parse(data);
      } catch (error) {
        throw new Error('Error reading permission data');
      }
    }
  }
  
  