import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../users/dtos/auth.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //extract the JSON Web Token (JWT) from the Authorization header of the incoming HTTP request, 
      //treating it as a Bearer token.
      secretOrKey: process.env.JWT_REFRESH_SECRET, //retrive secret key from the environment variables, specifically JWT_REFRESH_SECRET.
      passReqToCallback: true,
    });
  }
  //Inside the validate method, the refresh token is extracted from 
  //the Authorization header of the request using req.get('Authorization'). 
  //It then removes the "Bearer" prefix and trims any whitespace to get the raw refresh token.
  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
