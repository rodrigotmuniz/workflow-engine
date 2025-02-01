import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TaskEventEmitter } from './task-event-emitter.service'
import { TaskQueuesController } from './task-queues.controller'
import { TaskQueuesProcessor } from './task-queues.processor'
import { TaskQueuesService } from './task-queues.service'
import { EventEmitterService } from './event-emitter.service'

@Module({
  imports: [
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
  controllers: [TaskQueuesController],
  providers: [TaskQueuesService, TaskQueuesProcessor, TaskEventEmitter, EventEmitterService],
})
export class TaskQueuesModule {}
