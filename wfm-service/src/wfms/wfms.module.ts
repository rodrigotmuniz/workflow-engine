import { Module } from '@nestjs/common'
import { TaskQueuesService } from './services/task-queues.service'
import { WfmsController } from './wfms.controller'
import { WfmsService } from './wfms.service'
import { ClientsModule } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.TASK_QUEUE_CLIENT || 'TASK_QUEUE_CLIENT',
        options: {
          host: process.env.TASK_QUEUE_HOST ?? 'localhost',
          port: Number(process.env.TASK_QUEUE_PORT || 3003),
        },
      },
    ]),
  ],
  controllers: [WfmsController],
  providers: [WfmsService, TaskQueuesService],
})
export class WfmsModule {}
