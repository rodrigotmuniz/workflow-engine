import { Module } from '@nestjs/common'
import { TaskQueuesService } from './task-queues.service'
import { TaskQueuesController } from './task-queues.controller'
import { ClientsModule } from '@nestjs/microservices'
import { BullModule } from '@nestjs/bull'
import { ServerBProcessor } from './task-queues.processor'

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.TASK_QUEUE_CLIENT || 'TASK_QUEUE_CLIENT',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),
  ],
  controllers: [TaskQueuesController],
  providers: [TaskQueuesService, ServerBProcessor],
}) 
export class TaskQueuesModule {}
