import { Module } from '@nestjs/common'
import { DefinitionsModule } from './definitions/definitions.module'
// import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_FILTER } from '@nestjs/core'
import { AppAllExceptionsFilter } from './commons/filters/app-all-exceptions.filter'
import { AppErrorFilter } from './commons/filters/app-error.filter'
import { AppHttpExceptionFilter } from './commons/filters/app-http-exception.filter'
import { AppQueryFailedErrorFilter } from './commons/filters/app-query-failed-error.filter'

@Module({
  imports: [DefinitionsModule],
  providers: [
    { provide: APP_FILTER, useClass: AppAllExceptionsFilter },
    { provide: APP_FILTER, useClass: AppErrorFilter },
    { provide: APP_FILTER, useClass: AppHttpExceptionFilter },
    { provide: APP_FILTER, useClass: AppQueryFailedErrorFilter },
  ],
})
export class AppModule {}
