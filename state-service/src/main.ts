import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { MicroserviceOptions } from '@nestjs/microservices'
import { ResponseInterceptor } from './commons/interceptors/response.interceptor'
import { AppAllExceptionsFilter } from './commons/filters/app-all-exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    options: {
      host: '0.0.0.0',
      port: Number(process.env.WF_INSTANCE_PORT || 3004),
    },
    logger: new ConsoleLogger({
      prefix: 'WF Instances Service',
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
