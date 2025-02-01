import { Module } from '@nestjs/common'
import { TaskQueuesModule } from './task-queues/task-queues.module'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterService } from './task-queues/event-emitter.service'

@Module({
  imports: [ConfigModule.forRoot(), TaskQueuesModule],
})
export class AppModule {}
