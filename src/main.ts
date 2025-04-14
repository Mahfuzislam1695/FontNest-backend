// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import helmet from 'helmet';
// import * as compression from 'compression';
// import { Logger } from 'nestjs-pino';
// import { ConfigService } from '@nestjs/config';
// import { ensureDirSync } from 'fs-extra';
// import { join } from 'path';

// async function bootstrap() {
//   // Create app with logger
//   const app = await NestFactory.create(AppModule, {
//     bufferLogs: true,
//   });

//   // Setup logger
//   app.useLogger(app.get(Logger));

//   // Security middlewares
//   app.use(helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: [`'self'`],
//         styleSrc: [`'self'`, `'unsafe-inline'`],
//         imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
//         scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
//       },
//     },
//   }));

//   app.use(compression());

//   // Ensure upload directory exists
//   const configService = app.get(ConfigService);
//   const uploadPath = configService.get<string>('STORAGE_DESTINATION', 'uploads');
//   ensureDirSync(join(process.cwd(), uploadPath));

//   // Global validation pipe
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//       transformOptions: {
//         enableImplicitConversion: true,
//       },
//       disableErrorMessages: process.env.NODE_ENV === 'production',
//     }),
//   );

//   // Swagger documentation (only in development)
//   if (process.env.NODE_ENV !== 'production') {
//     const config = new DocumentBuilder()
//       .setTitle('Font Group Management API')
//       .setDescription('API for managing font groups and individual fonts')
//       .setVersion('1.0')
//       .addBearerAuth()
//       .addServer(process.env.API_BASE_URL || 'http://localhost:3333')
//       .build();

//     const document = SwaggerModule.createDocument(app, config);
//     SwaggerModule.setup('api-docs', app, document, {
//       explorer: true,
//       swaggerOptions: {
//         filter: true,
//         showRequestDuration: true,
//         persistAuthorization: true,
//       },
//     });
//   }

//   // Enable shutdown hooks
//   app.enableShutdownHooks();

//   // Start application
//   const port = process.env.PORT || 3333;
//   await app.listen(port, '0.0.0.0');

//   const logger = app.get(Logger);
//   logger.log(`Application is running on: http://localhost:${port}`);
//   logger.log(`Swagger UI is running on: http://localhost:${port}/api-docs`);
// }

// bootstrap().catch(err => {
//   console.error('Application bootstrap failed:', err);
//   process.exit(1);
// });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  //   prefix: '/uploads',
  // });
  // Security middlewares
  app.use(helmet());
  app.use(compression());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Font Group Management API')
    .setDescription('API for managing font groups and individual fonts')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 3333);
  console.log(`Application is running on: http://localhost:${process.env.PORT || 3333}`);
  console.log(`Swagger UI is running on: http://localhost:${process.env.PORT || 3333}/api-docs`);
}
bootstrap();
