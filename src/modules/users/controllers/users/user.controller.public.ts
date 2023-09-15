import { Controller, Post, Body} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('user/public')
@Controller('user/pubic')
@ApiBearerAuth()
export class UsersControllerPublic {
    constructor(private userService: UsersService) {}
    @Post()
    @ApiOperation({ summary: 'Create user public' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    createUserPublic(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }
}