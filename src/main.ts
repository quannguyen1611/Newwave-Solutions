// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const config = new DocumentBuilder()
//     .setTitle('Users example')
//     .setDescription('The users API description')
//     .setVersion('1.0')
//     .addTag('users')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);
//   await app.listen(3000);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  VersioningType,
  Logger as NestLoger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as WinstonCloudWatch from 'winston-cloudwatch';

async function bootstrap() {
  const loggerTransports = [
    new transports.Console({
      format: format.combine(
        format.cli(),
        format.splat(),
        format.timestamp(),
        format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }),
      ),
    }),
  ] as any[];
  if (process.env.IS_ENABLE_CLOUDWATCH === 'true') {
    loggerTransports.push(
      new WinstonCloudWatch({
        level: 'error',
        logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
        logStreamName: function () {
          const date = new Date().toISOString().split('T')[0];
          return date;
        },
        awsRegion: process.env.CLOUDWATCH_AWS_REGION,
        awsOptions: {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_KEY_SECRET,
          },
        },
        jsonMessage: true,
      }),
    );
  }

  if (process.env.IS_ENABLE_LOG_ON_LOCALLY === 'true') {
    // reference: https://lsmod.medium.com/nestjs-setting-up-file-logging-daily-rotation-with-winston-28147af56ec4
    loggerTransports.push([
      // file on daily rotation (error only)
      new transports.DailyRotateFile({
        // %DATE will be replaced by the current date
        filename: `logs/%DATE%-error.log`,
        level: 'error',
        format: format.combine(format.timestamp(), format.json()),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false, // don't want to zip our logs
        maxFiles: '30d', // will keep log until they are older than 30 days
      }),
      // same for all levels
      new transports.DailyRotateFile({
        filename: `logs/%DATE%-combined.log`,
        format: format.combine(format.timestamp(), format.json()),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
    ]);
  }

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: loggerTransports,
    }),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setDescription('The nest template API description')
    .setVersion('3.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT') || 3000;
  await app.listen(port, () => {
    const nestLogger = new NestLoger();
    nestLogger.log(`My nest template app\'s running on ${port}`);
  });
}
bootstrap();
