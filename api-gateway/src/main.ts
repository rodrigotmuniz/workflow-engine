import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Api Gateway',
      json: Boolean(process.env.JSON_LOG || false),
    }),
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
