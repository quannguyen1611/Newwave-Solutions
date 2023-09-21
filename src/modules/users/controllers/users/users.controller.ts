import { Controller, Get, Post, Body, ParseIntPipe, Put, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { Param } from '@nestjs/common';
import { UpdateUserDto } from 'src/modules/users/dtos/UpdateUser.dto';
import { CreateUserProfileDto } from 'src/modules/users/dtos/CreateUserProfile.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EPermissions } from 'src/shared/permission.enum';
import { AccessTokenGuard } from '../../../../guard/access-token.guard';
import { Permissions } from '../../../../decorator/permission.decorator';
import { PermissionGuard } from 'src/guard/permission.guard';
import { User } from 'src/decorator/user.decorator';

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
    createUser(@Body() createUserDto: CreateUserDto, @User() user: any) {
        return this.userService.createUser(createUserDto, user);
    }

    @Get()
    @ApiOperation({ summary: 'Find user by ID' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Permissions(EPermissions.CmsUserRead)
    @UseGuards(AccessTokenGuard, PermissionGuard)
    getUsers() {
        return this.userService.findById();
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Permissions(EPermissions.CmsUserUpdate)
    @UseGuards(AccessTokenGuard, PermissionGuard)
    async updateUserById(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @User() user: any
    ) {
        await this.userService.updateUser(id, updateUserDto, user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Permissions(EPermissions.CmsUserDelete)
    @UseGuards(AccessTokenGuard, PermissionGuard)
    deleteUserById(@Param('id', ParseIntPipe) id: number, @User() user: any){
        return this.userService.deleteUser(id, user);
    }

    @Post(':id/profiles')
    @ApiOperation({ summary: 'Create profile' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Permissions(EPermissions.CmsProfileCreate)
    @UseGuards(AccessTokenGuard, PermissionGuard)
    CreateUserProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() createUserProfileDto: CreateUserProfileDto,
    ) {
        return this.userService.createUserProfile(id, createUserProfileDto);
    }

    @Delete(':id/profiles')
    @ApiOperation({ summary: 'Delete profile' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Permissions(EPermissions.CmsProfileDelete)
    @UseGuards(AccessTokenGuard, PermissionGuard)
    DeleteUserProfile(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.userService.deleteUserProfile(id);
    }

    @Get('findUser')
    async findUser(@User('id') id: number) {
        if (!id) {
            throw new BadRequestException('User not found');
        }
        return id;
    }
}