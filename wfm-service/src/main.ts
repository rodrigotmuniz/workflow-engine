import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ConsoleLogger, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: Number(process.env.WFM_CLIENT_CLIENT || 3002) },
    logger: new ConsoleLogger({
      prefix: 'WFM Service',
      json: Boolean(process.env.JSON_LOG || false),
    }),
  })

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.REDIS,
  //   options: { host: 'localhost', port: 6379 },
  // })

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
