import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { WfmsClientService } from './wfm-client.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.WFM_QUEUE || 'WFM_QUEUE',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6000),
      },
    }),
  ],
  providers: [WfmsClientService],
  exports: [WfmsClientService],
})
export class WfmsClientModule {}
