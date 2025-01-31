import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { WfmsModule } from './wfms/wfms.module'
import { ResponseInterceptor } from './commons/interceptors/response.interceptor'
import { AppAllExceptionsFilter } from './commons/filters/app-all-exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(WfmsModule, {
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

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new AppAllExceptionsFilter())

  await app.listen()
}
void bootstrap()
