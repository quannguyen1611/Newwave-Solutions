import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Delete,
    Query,
  } from '@nestjs/common';
  import { RoleService } from './role.service';
  import {
    CreateRoleDto,
    DeleteRoleDto,
    QueryRoleDto,
    ResponseRoleDto,
    ResponseRolePagingDto,
    UpdateRoleDto,
  } from '../users/dtos/Role.dto';
  import { IRole } from './role.interface';
  import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
  
  @ApiTags('Roles')
  @Controller('roles')
  export class RoleController {
    constructor(private roleService: RoleService) {}
  
    @Post('')
    @ApiCreatedResponse({
      type: ResponseRoleDto,
    })
    async create(@Body() createRoleDto: CreateRoleDto): Promise<IRole> {
      return this.roleService.create(createRoleDto);
    }
  
    @Get(':id')
    @ApiCreatedResponse({
      type: ResponseRoleDto,
    })
    async findOne(@Param('id') id: number): Promise<IRole> {
      return this.roleService.findOne(id);
    }
  
    @Get('')
    @ApiCreatedResponse({
      type: ResponseRolePagingDto,
    })
    async findAll(@Query() query: QueryRoleDto): Promise<ResponseRolePagingDto> {
      return this.roleService.findAll(query);
    }
  
    @Put(':id')
    @ApiCreatedResponse({
      type: ResponseRoleDto,
    })
    async updateOne(
      @Param('id') id: number,
      @Body() updateRoleDto: UpdateRoleDto,
    ): Promise<IRole> {
      return this.roleService.updateOne(id, updateRoleDto);
    }
  
    @Delete(':id')
    async deleteOne(@Param('id') id: number): Promise<void> {
      return this.roleService.deleteOne(id);
    }
  
    @Delete('delete/bulk')
    async deleteMany(@Body() deleteRoleDto: DeleteRoleDto): Promise<void> {
      return this.roleService.deleteMany(deleteRoleDto.ids);
    }
  }
  