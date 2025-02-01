import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { TaskQueuesClientService } from './task-queues-client.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.TASK_QUEUE || 'TASK_QUEUE',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6000),
      },
    }),
  ],
  providers: [TaskQueuesClientService],
  exports: [TaskQueuesClientService],
})
export class TaskQueuesClientModule {}
