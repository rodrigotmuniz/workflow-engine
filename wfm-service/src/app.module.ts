import { Module } from '@nestjs/common'
import { WfmsModule } from './wfms/wfms.module'
import { DefinitionsClientModule } from './definitions-client/definitions-client.module'

@Module({
  imports: [WfmsModule],
})
export class AppModule {}
