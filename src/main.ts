import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for your frontend with credentials
  app.enableCors({
    origin: [
      'http://localhost:5173', // for local development
      'https://pro-forge.vercel.app', // your main frontend
      'https://pro-forge-71kr.vercel.app', // temporary or preview URL
    ], // Frontend origin (Vite dev server)
    credentials: true, // Allow cookies or Authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ Enable validation globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap();
