import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: { host: 'localhost', port: 6000 },
    logger: new ConsoleLogger({
      prefix: 'Task Queue Service',
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
 