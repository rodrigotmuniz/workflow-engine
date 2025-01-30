import { Module } from '@nestjs/common'
import { TaskQueuesService } from './task-queues.service'
import { TaskQueuesController } from './task-queues.controller'
import { ClientsModule } from '@nestjs/microservices'

@Module({
  controllers: [TaskQueuesController],
  providers: [TaskQueuesService],
})
export class TaskQueuesModule {}
