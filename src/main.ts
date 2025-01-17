import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { mySqlDataSource } from './config/datasource/datasource';
import { bootstrap } from './scripts/db-init';

async function bootstrap1() {
  // mySqlDataSource
  //   .initialize()
  //   .then(() => {
  //     console.log('Data Source has been initialized!');
  //   })
  //   .catch((err) => {
  //     console.error('Error during Data Source initialization', err);
  //   });

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true }); // Set the correct origin for the production
  await app.listen(process.env.PORT ?? 3000);
  //bootstrap();
}
bootstrap1();
