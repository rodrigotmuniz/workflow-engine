import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TaskQueuesProcessor } from './task-queues.processor'
import { WfmsClientModule } from 'src/wfm-client/wfm-client.module'
import { DlqsClientModule } from 'src/dlq-client/dlq-client.module'

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
    DlqsClientModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [TaskQueuesProcessor],
})
export class TaskQueuesModule {}
