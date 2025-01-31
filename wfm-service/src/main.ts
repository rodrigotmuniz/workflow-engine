import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    options: {
      host: '0.0.0.0',
      port: Number(process.env.WFM_PORT),
    },
    logger: new ConsoleLogger({
      prefix: 'WFM Service',
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

  // app.useGlobalInterceptors(new ResponseInterceptor())

  await app.listen()
}
void bootstrap()
