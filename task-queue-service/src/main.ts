import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      // transport: Transport.REDIS,
      options: {
        host: '0.0.0.0',
        port: Number(process.env.TASK_QUEUE_PORT || 3003),
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    }),
  );

  // app.useGlobalInterceptors(new ResponseInterceptor())

  await app.listen();
}
void bootstrap();
