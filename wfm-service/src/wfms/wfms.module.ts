import { Module } from '@nestjs/common'
import { TaskQueuesService } from './services/task-queues.service'
import { WfmsController } from './wfms.controller'
import { WfmsService } from './wfms.service'
import { BullModule } from '@nestjs/bull'
import { ServerBProcessor } from './task-queues.processor'
import { DefinitionsClientModule } from 'src/definitions-client/definitions-client.module'
import { StatesClientModule } from 'src/states-client/states-client.module'

@Module({
  imports: [
    DefinitionsClientModule,
    StatesClientModule,
    BullModule.registerQueue({
      name: process.env.TASK_QUEUE_CLIENT || 'TASK_QUEUE_CLIENT',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6000),
      },
    }),
  ],
  controllers: [WfmsController],
  providers: [WfmsService, TaskQueuesService, ServerBProcessor],
})
export class WfmsModule {}
