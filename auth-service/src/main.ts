import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { AppAllExceptionsFilter } from './commons/filters/app-all-exceptions.filter';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    options: {
      host: '0.0.0.0',
      port: Number(process.env.AUTH_PORT),
    },
    logger: new ConsoleLogger({
      prefix: 'Auth Service',
      json: Boolean(process.env.JSON_LOG || false),
    }),
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    }),
  )

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new AppAllExceptionsFilter())

  await app.listen()
}

void bootstrap()
