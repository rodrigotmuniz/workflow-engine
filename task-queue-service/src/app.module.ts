import { Module } from '@nestjs/common';
import { TaskQueuesModule } from './task-queues/task-queues.module';

@Module({
  imports: [TaskQueuesModule],
})
export class AppModule {}
