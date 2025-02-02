import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { DlqsClientService } from './dlq-client.service'
import { DlqProcessor } from './dlq-client.processor'
import { SocketModule } from 'src/socket/socket.module'

@Module({
  imports: [
    SocketModule,
    BullModule.registerQueue({
      name: process.env.DLQ_QUEUE || 'DLQ_QUEUE',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6000),
      },
    }),
  ],
  providers: [DlqsClientService, DlqProcessor],
  exports: [DlqsClientService],
})
export class DlqsClientModule {}
