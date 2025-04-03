import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Middleware
  app.use(compression());
  app.use(helmet());
  
  // CORS
  app.enableCors();
  
  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Aldilaijan & Khobara API')
    .setDescription('API documentation for Aldilaijan Real Estate and Khobara Valuation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
