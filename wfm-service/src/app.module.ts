import { Module } from '@nestjs/common'
import { WfmsModule } from './wfms/wfms.module'
import { DefinitionsClientModule } from './definitions-client/definitions-client.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot(), WfmsModule],
})
export class AppModule {}
