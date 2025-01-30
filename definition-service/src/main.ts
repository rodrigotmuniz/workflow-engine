import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { MicroserviceOptions } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    options: {
      host: '0.0.0.0',
      port: Number(process.env.DEFINITION_PORT || 3003),
    },
    logger: new ConsoleLogger({
      prefix: 'Defintions Service',
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
