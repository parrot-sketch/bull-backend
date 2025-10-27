import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for mobile app (including Android emulator)
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:8081', 
      'http://localhost:19006',
      'http://192.168.100.110:3000', // Your actual network IP
      'http://192.168.100.40:3000',  // Keep for compatibility
      'http://10.0.2.2:3000', // Android emulator localhost mapping
      'http://10.0.2.15:3000' // Alternative Android emulator IP
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('iHosi Healthcare API')
    .setDescription('Enterprise Healthcare Information Management System - Authentication Module')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  const host = '0.0.0.0'; // Listen on all interfaces for Android emulator access
  await app.listen(port, host);
  
  console.log(`🚀 iHosi Healthcare API running on http://localhost:${port}`);
  console.log(`📱 Android Emulator Access: http://192.168.100.40:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🔐 Authentication Module: Enterprise Grade`);
}

bootstrap();