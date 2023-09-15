import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { AuthGuard } from '@nestjs/passport';
  
  @Injectable()
  export class AccessTokenGuard extends AuthGuard('jwt') {
    constructor(private readonly jwtService: JwtService) {
      super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> { //validate access tokens in incoming HTTP requests
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
        // We're assiginign the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } catch (e) {
        throw new UnauthorizedException();
      }
      return true;
    }
    //extract token from header then split
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers['authorization']?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  