import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrap } from './scripts/db-init';

async function bootstrap1() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true }); // Set the correct origin for the production
  await app.listen(process.env.PORT ?? 3000);
 // bootstrap();
}
bootstrap1();
