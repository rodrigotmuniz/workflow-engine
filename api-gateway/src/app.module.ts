import { Module } from '@nestjs/common';
import { WfmClientModule } from './wfm-client/wfm-client.module';
import { DefinitionsModule } from './definition-service/definitions.module';

@Module({
  imports: [WfmClientModule, DefinitionsModule],
})
export class AppModule {}
