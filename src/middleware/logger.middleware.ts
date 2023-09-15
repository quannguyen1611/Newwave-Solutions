import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(); //initializes a private logger instance using the Logger class.
  //This logger will be used to log information about HTTP requests and responses.

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => { //sets up an event listener for when the response (res) finishes processing. 
      const statusCode = res.statusCode; //retrives the HTTP status from the response object, 
      //which indicates the outcome of the request.
      switch (statusCode) {
        case HttpStatus.INTERNAL_SERVER_ERROR:
          this.logger.error(`[${req.method}] ${req.url} - ${statusCode}`);
          break;
        case HttpStatus.UNAUTHORIZED:
        case HttpStatus.TOO_MANY_REQUESTS:
          this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
          break;
        default:
          break;
      }
    });
    next();
  }
}
