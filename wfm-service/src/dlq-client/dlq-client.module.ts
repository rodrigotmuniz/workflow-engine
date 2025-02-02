import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { DlqsClientService } from './dlqclient.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.DLQ_QUEUE || 'DLQ_QUEUE',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6000),
      },
    }),
  ],
  providers: [DlqsClientService],
  exports: [DlqsClientService],
})
export class DlqsClientModule {}
