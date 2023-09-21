import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator( //exports a custom parameter decorator 
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); //extracts the request object from the execution context (ctx) using the switchToHttp() method
    const user = request.user;
    return data ? user?.[data] : user;
  },
);