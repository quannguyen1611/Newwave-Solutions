import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../users/dtos/auth.dto';
import { UsersService } from '../users/services/users/users.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  userService: UsersService;
  constructor(
  ) {
    //super is used to call the constructor of the parent class (PassportStrategy)
    super({
      //uses the fromAuthHeaderAsBearerToken method from the ExtractJwt class 
      //to extract the token from the Authorization header in the form of a bearer token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }
  //validate the contents of the JWT payload after it has been successfully decoded
  async validate(payload: JwtPayload) {
    return payload;
  }
}
