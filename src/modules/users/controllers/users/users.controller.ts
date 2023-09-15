import { Controller, Get, Post, Body, ParseIntPipe, Put, Delete, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { Param } from '@nestjs/common';
import { UpdateUserDto } from 'src/modules/users/dtos/UpdateUser.dto';
import { CreateUserProfileDto } from 'src/modules/users/dtos/CreateUserProfile.dto';
import { LoginUserDto } from 'src/modules/users/dtos/LoginUser.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EPermissions } from 'src/shared/permission.enum';
import { AccessTokenGuard } from '../../../../guard/access-token.guard';
import { Permissions } from '../../../../decorator/permission.decorator';
import { PermissionGuard } from 'src/guard/permission.guard';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Permissions(EPermissions.CmsUserCreate)
    @UseGuards(AccessTokenGuard, PermissionGuard)
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Find user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    getUsers() {
        return this.userService.findUsers();
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async updateUserById(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        await this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async deleteUserById(@Param('id', ParseIntPipe) id: number){
        await this.userService.deleteUser(id);
    }

    @Post(':id/profiles')
    @ApiOperation({ summary: 'Create profile' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    CreateUserProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() createUserProfileDto: CreateUserProfileDto,
    ) {
        return this.userService.createUserProfile(id, createUserProfileDto);
    }

    @Delete(':id/profiles')
    @ApiOperation({ summary: 'Delete profile' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    DeleteUserProfile(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.userService.deleteUserProfile(id);
    }
}