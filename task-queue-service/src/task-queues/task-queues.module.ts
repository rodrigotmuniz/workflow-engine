import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TaskQueuesProcessor } from './processors/task-queues.processor'
import { WfmsClientModule } from 'src/wfm-client/wfm-client.module'

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.TASK_QUEUE || 'TASK_QUEUE', 
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6000),
      },
    }),
    WfmsClientModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [TaskQueuesProcessor],
})
export class TaskQueuesModule {}
