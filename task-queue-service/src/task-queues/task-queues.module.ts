import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TaskQueuesProcessor } from './processors/task-queues.processor'
import { EventEmitterService } from './services/event-emitter.service'

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
  providers: [TaskQueuesProcessor, EventEmitterService],
})
export class TaskQueuesModule {}
