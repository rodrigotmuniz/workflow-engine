import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Api Gateway',
      json: Boolean(process.env.JSON_LOG || false),
    }),
  });
  app.useGlobalInterceptors(new ResponseInterceptor())
  await app.listen(process.env.API_GATEWAY_PORT ?? 3001);
}
void bootstrap();
