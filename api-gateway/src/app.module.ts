import { Module } from '@nestjs/common'
import { WfmClientModule } from './wfm-client/wfm-client.module'
import { DefinitionsModule } from './definition-service/definitions.module'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { AppAllExceptionsFilter } from './commons/filters/app-all-exceptions.filter'
import { AuthClientModule } from './auth-client/auth-client.module'

@Module({
  imports: [WfmClientModule, DefinitionsModule, AuthClientModule],
  providers: [{ provide: APP_FILTER, useClass: AppAllExceptionsFilter }],
})
export class AppModule {}
