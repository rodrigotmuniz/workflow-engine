import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { LogsClientService } from './logs-client.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.LOGS_QUEUE || 'LOGS_QUEUE',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6000),
      },
    }),
  ],
  providers: [LogsClientService],
  exports: [LogsClientService],
})
export class LogsClientModule {}
