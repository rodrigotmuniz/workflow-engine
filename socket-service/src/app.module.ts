import { Module } from '@nestjs/common'
import { LogsClientModule } from './logs-client/logs-client.module'

@Module({
  imports: [LogsClientModule],
})
export class AppModule {}
