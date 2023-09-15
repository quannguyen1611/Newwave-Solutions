import {
    BadRequestException,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { UsersService } from '../users/services/users/users.service';
  import { JwtService } from '@nestjs/jwt';
  import {
    JwtPayload,
    ResponseAuthDto,
    ResponseProfileDto,
    SignInDto,
  } from '../users/dtos/auth.dto';
  import * as bcrypt from 'bcrypt';
  import { ConfigService } from '@nestjs/config';
  import { User } from '../typeorm/entities/user.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  
  @Injectable()
  export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private configService: ConfigService,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}
    //retrive user's profile based on thier id 
    async getProfile(id: number): Promise<ResponseProfileDto> {
      return await this.userRepository.findOneBy({id: id});
    }
    //This method is expected to check if the provided refreshToken is valid for the given user (userId)
    // and then generate and return new access and refresh tokens.
    async refreshTokens(
      userId: number,
      refreshToken: string,
    ): Promise<ResponseAuthDto> {
      const user = await this.userRepository.findOneBy({ id: userId }); //find user by userId
      if (!user || !user.refreshToken || (await bcrypt.compare(refreshToken, user?.password))) {
        throw new ForbiddenException('Access Denied');
      }
  
      const tokens = await this.getTokens(user.username, user.id, user.email); //generate new authentication tokens
      await this.updateRefreshToken(user.id, tokens.refreshToken); //then update user's refresh token
      return tokens;
    }
    //This method is responsible for validating the user's credentials, 
    //generating new access and refresh tokens, and returning them.
    async signIn(signInDto: SignInDto): Promise<ResponseAuthDto> {
      const { username, password } = signInDto;
      const payload = await this.validateUser(username, password); //variable payload contains valiadated username and password
  
      if (!payload) {
        throw new BadRequestException('User does not exist');
      }
      //generate new authentication tokens using the getTokens method.
      const tokens = await this.getTokens(username, payload.sub, payload.email);
      await this.updateRefreshToken(payload.sub, tokens.refreshToken);
      return tokens;
    }
  
    async logout(userId: number): Promise<void> {
      await this.updateRefreshToken(userId, null);
      return;
    }
    //This method updates the refresh token for a user. It takes a userId and a new refreshToken as parameters, 
    //likely after generating a new one during token refresh.
    async updateRefreshToken(userId: number, refreshToken: string) {
      const user = await this.userRepository.findOneBy({ id: userId });
      user.refreshToken = await this.usersService.generateHash(refreshToken);
      return this.userRepository.save(user);
    }
    //The getTokens method generates new access and refresh tokens based on the provided username, userId, and email.
    async getTokens(
      username: string,
      userId: number,
      email: string,
    ): Promise<ResponseAuthDto> {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: userId,
            username,
            email,
          },
          {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get<string>(
              'JWT_ACCESS_SECRET_EXPIRES_IN',
            ),
          },
        ),
        this.jwtService.signAsync(
          {
            sub: userId,
            username,
            email,
          },
          {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>(
              'JWT_REFRESH_SECRET_EXPIRES_IN',
            ),
          },
        ),
      ]);
  
      return {
        accessToken,
        refreshToken,
      };
    }
  
    async getToken({ username, sub, email }): Promise<ResponseAuthDto> {
      const payload = {
        username,
        sub,
        email,
      };
      return {
        accessToken: await this.jwtService.signAsync(payload),
      } as ResponseAuthDto;
    }
    //The validateUser method is used to validate a user's credentials (username or email and password) during sign-in
    async validateUser(
      usernameOrEmail: string,
      password: string,
    ): Promise<JwtPayload> {
      const user = await this.usersService.findOne(usernameOrEmail);
      const isMatchPassword = await bcrypt.compare(password, user?.password); //compare if the 2 passwords match
      if (isMatchPassword) {
        const payload: JwtPayload = {
          username: user.username,
          sub: user.id,
          email: user.email,
        };
        return payload;
      }
      return null;
    }
  }
  