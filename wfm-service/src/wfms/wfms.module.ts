import { Module } from '@nestjs/common'
import { TaskQueuesService } from './services/task-queues.service'
import { WfmsController } from './wfms.controller'
import { WfmsService } from './wfms.service'
import { ClientsModule } from '@nestjs/microservices'
import { BullModule } from '@nestjs/bull'
import { ServerBProcessor } from './task-queues.processor'

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: process.env.TASK_QUEUE_CLIENT || 'TASK_QUEUE_CLIENT',
    //     options: {
    //       host: process.env.TASK_QUEUE_HOST ?? 'localhost',
    //       port: Number(process.env.TASK_QUEUE_PORT || 3003),
    //     },
    //   },
    // ]),
    BullModule.registerQueue({
      name: process.env.TASK_QUEUE_CLIENT || 'TASK_QUEUE_CLIENT',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),
  ],
  controllers: [WfmsController],
  providers: [WfmsService, TaskQueuesService, ServerBProcessor],
})
export class WfmsModule {}
