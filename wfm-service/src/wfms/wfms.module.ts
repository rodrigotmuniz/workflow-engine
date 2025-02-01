import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { DefinitionsClientModule } from 'src/definitions-client/definitions-client.module'
import { StatesClientModule } from 'src/states-client/states-client.module'
import { TaskQueuesClientModule } from 'src/task-queues-client/task-queues-client.module'
import { WfmsProcessor } from './processors/wfms.processor'
import { WfmsService } from './services/wfms.service'
import { WfmsController } from './wfms.controller'

@Module({
  imports: [
    DefinitionsClientModule,
    StatesClientModule,
    TaskQueuesClientModule,
    BullModule.registerQueue({
      name: process.env.WFM_QUEUE || 'WFM_QUEUE',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6000),
      },
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [WfmsController],
  providers: [WfmsService, WfmsProcessor],
})
export class WfmsModule {}
