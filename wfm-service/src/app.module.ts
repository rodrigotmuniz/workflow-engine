import { Module } from '@nestjs/common'
import { WfmsModule } from './wfms/wfms.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot(), WfmsModule],
})
export class AppModule {}
