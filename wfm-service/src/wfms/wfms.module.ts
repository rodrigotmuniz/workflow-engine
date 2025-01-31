import { Module } from '@nestjs/common'
import { TaskQueuesService } from './services/task-queues.service'
import { WfmsController } from './wfms.controller'
import { WfmsService } from './wfms.service'
import { ClientsModule } from '@nestjs/microservices'
import { BullModule } from '@nestjs/bull'
import { ServerBProcessor } from './task-queues.processor'
import { DefinitionsClientModule } from 'src/definitions-client/definitions-client.module'
import { DefinitionsClientService } from 'src/definitions-client/definitions-client.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    DefinitionsClientModule, 
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
