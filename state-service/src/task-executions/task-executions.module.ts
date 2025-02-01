import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaskExecution } from './entities/task-execution.entity'
import { TaskExecutionsController } from './task-executions.controller'
import { TaskExecutionsService } from './task-executions.service'

@Module({
  imports: [TypeOrmModule.forFeature([TaskExecution])],
  controllers: [TaskExecutionsController],
  providers: [TaskExecutionsService],
})
export class TaskExecutionsModule {}
