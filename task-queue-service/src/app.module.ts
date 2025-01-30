import { Module } from '@nestjs/common'
import { TaskQueuesModule } from './task-queues/task-queues.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot(), TaskQueuesModule],
})
export class AppModule {}
