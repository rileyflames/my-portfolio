import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  /**
   * CORS Configuration
   * 
   * SECURITY: Configure CORS to only allow requests from your frontend
   * 
   * DEVELOPMENT: Allow localhost:5173 (Vite default)
   * PRODUCTION: Replace with your actual frontend domain
   * 
   * WHY THIS MATTERS:
   * - Prevents unauthorized websites from calling your API
   * - Protects against CSRF attacks
   * - Ensures only your frontend can access admin endpoints
   */
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3000);
}
bootstrap();
