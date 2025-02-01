import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TaskQueuesModule } from './task-queues/task-queues.module'

@Module({
  imports: [ConfigModule.forRoot(), TaskQueuesModule],
})
export class AppModule {}
