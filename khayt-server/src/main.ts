import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
const cookieSession = require('cookie-session');
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: [process.env.COOKIE_SECRET],
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
