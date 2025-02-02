import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { SocketModule } from 'src/socket/socket.module'
import { LogProcessor } from './logs-client.processor'

@Module({
  imports: [
    SocketModule,
    BullModule.registerQueue({
      name: process.env.LOGS_QUEUE || 'LOGS_QUEUE',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6000),
      },
    }),
  ],
  providers: [LogProcessor],
  exports: [],
})
export class LogsClientModule {}
