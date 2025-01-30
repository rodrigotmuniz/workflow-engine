import { Module } from '@nestjs/common'
import { WfmClientModule } from './wfm-client/wfm-client.module'
import { DefinitionsModule } from './definition-service/definitions.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot(), WfmClientModule, DefinitionsModule],
})
export class AppModule {}
