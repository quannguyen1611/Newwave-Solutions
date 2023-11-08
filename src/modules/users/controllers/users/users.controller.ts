import { Controller, Get, Post, Body, ParseIntPipe, Put, Delete, UseGuards, BadRequestException, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { Param } from '@nestjs/common';
import { UpdateUserDto } from 'src/modules/users/dtos/UpdateUser.dto';
import { CreateUserProfileDto } from 'src/modules/users/dtos/CreateUserProfile.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EPermissions } from 'src/shared/permission.enum';
import { AccessTokenGuard } from '../../../../guard/access-token.guard';
import { Permissions } from '../../../../decorator/permission.decorator';
import { PermissionGuard } from 'src/guard/permission.guard';
import { User } from 'src/decorator/user.decorator';
import { ChangePasswordDto } from '../../dtos/ChangePassword.dto';
import { ForgotPasswordDto } from '../../dtos/ForgotPassword.dto';
import { UpdatePasswordDto } from '../../dtos/UpdatePassword.dto'
import { PasswordAuthDto } from '../../dtos/auth.dto';
import { FileUploadDto } from '../../dtos/fileUpload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../services/File/uploadFile';
import { UpdateUserFileParams } from 'src/modules/utils/types';
import { Response } from 'express';
import { QueryUserDto, ResponseUserPagingDto } from '../../dtos/OtherUser.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}

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

    @Get()
    @ApiCreatedResponse({
      type: ResponseUserPagingDto,
    })
    @Permissions(EPermissions.CmsUserRead)
    @UseGuards(AccessTokenGuard, PermissionGuard)
    findAll(@Query() query: QueryUserDto): Promise<ResponseUserPagingDto> {
      return this.userService.findAll(query);
    }

    @Get('users')
    @ApiOperation({ summary: 'Export user' })
    async exportCsv(@Res() res: Response) {
        const filename = await this.userService.generateCsv(); // Call your service function to generate the CSV
        // Set the response headers for file download
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        // Send the file as a downloadable response
        res.download(filename, (error) => {
            // Handle any errors here, if necessary
            if (error) {
                // Log the error or handle it as needed
                console.error('Error while sending the file:', error);
            }
        });
    }

    @Put('ChangePassword')
    @ApiOperation({ summary: 'Change password' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UseGuards(AccessTokenGuard)
    async changePassword(
        @User() user: any,
        @Body() changePasswordDto: ChangePasswordDto
    ) {
        await this.userService.changePassword(user.username, changePasswordDto);
    }

    @Put('ForgotPassword')
    @ApiBody({type: ForgotPasswordDto,})
    @ApiOperation({ summary: 'Forgot password' })
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) : Promise<PasswordAuthDto> {
        return this.userService.forgotPassword(forgotPasswordDto);
    }

    @Put('UpdatePassword')
    @ApiOperation({ summary: 'Update new password' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async updateNewPassword(
        @Body() updatePasswordDto: UpdatePasswordDto
    ) {
        await this.userService.updateNewPassword(updatePasswordDto);
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
        @Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUserProfile(id);
    }

    @Get('findUser')
    async findUser(@User('id') id: number) {
        if (!id) {
            throw new BadRequestException('User not found');
        }
        return id;
    }

    @Post('/action/upload')
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('file', multerOptions))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
            description: 'User photo',
            type: FileUploadDto,
        })
    async upload( @UploadedFile() file, @User() user: any ) {
        console.log(file);
        user.uploadFile = file.originalname
        const updateUserFileDetails: UpdateUserFileParams = {
            uploadFile: file.originalname,
          };
        await this.userService.updateUser(user.sub, updateUserFileDetails, user);
    }

    @Post('/file/upload')
    @Permissions(EPermissions.CmsUserCreate)
    @UseGuards(AccessTokenGuard, PermissionGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ 
            description: 'Imported file',
            type: FileUploadDto,
        })
    async uploadFile(@UploadedFile() file: Express.Multer.File, @User() user : any) {
        this.userService.importFile(file, user);
    }
}