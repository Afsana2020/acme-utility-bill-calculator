import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for your frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://ah-utility-bill-calculator.vercel.app/' 
    ],
    credentials: true,
  });
  
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
