import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { DefinitionsClientModule } from 'src/definitions-client/definitions-client.module'
import { StatesClientModule } from 'src/states-client/states-client.module'
import { EventEmitterService } from './services/event-emitter.service'
import { TaskEventEmitter } from './services/task-event-emitter.service'
import { WfmsController } from './wfms.controller'
import { WfmsService } from './wfms.service'
import { WfmsProcessor } from './wfms.processor'

@Module({
  imports: [
    DefinitionsClientModule,
    StatesClientModule,
    BullModule.registerQueue({
      name: process.env.TASK_QUEUE || 'TASK_QUEUE',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6000),
      },
    }),
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
  providers: [
    WfmsService,
    EventEmitterService,
    WfmsProcessor,
    // ServerBProcessor,
    TaskEventEmitter,
  ],
})
export class WfmsModule {}
