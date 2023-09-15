import {
    Controller,
    Post,
    UseGuards,
    Get,
    Request,
    Body,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { ResponseAuthDto, SignInDto } from '../users/dtos/auth.dto';
  import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
  import { AccessTokenGuard } from '../../guard/access-token.guard';
  import { RefreshTokenGuard } from '../../guard/refresh-token.guard';
  
  @ApiTags('Auth')
  @ApiBearerAuth()
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @ApiBody({
      type: SignInDto,
    })
    @Post('sign-in')
    signIn(@Body() signInDto: SignInDto): Promise<ResponseAuthDto> {
      return this.authService.signIn(signInDto);
    }
  
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Request() req) {
      const userId = req.user?.sub;
      const refreshToken = req.user['refreshToken'];
      return this.authService.refreshTokens(userId, refreshToken);
    }
  
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @Get('me')
    getProfile(@Request() req) {
      return this.authService.getProfile(req.user?.sub);
    }
  
    @UseGuards(AccessTokenGuard)
    @Get('sign-out')
    logout(@Request() req) {
      return this.authService.logout(req.user?.sub);
    }
  }
  