import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateTaskExecutionDto } from './dto/create-task-execution.dto'
import { TaskExecutionsService } from './task-executions.service'

@Controller()
export class TaskExecutionsController {
  private readonly logger = new Logger(TaskExecutionsController.name)

  constructor(private readonly taskExecutionsService: TaskExecutionsService) {}

  @MessagePattern('[PATTERN]TaskExecutionsController.create')
  create(@Payload() createTaskExecutionDto: CreateTaskExecutionDto) {
    this.logger.log('create()')
    return this.taskExecutionsService.create(createTaskExecutionDto)
  }

  @MessagePattern('[PATTERN]TaskExecutionsController.createMany')
  createMany(@Payload() createTaskExecutionDtos: CreateTaskExecutionDto[]) {
    this.logger.log('createMany()')
    return this.taskExecutionsService.createMany(createTaskExecutionDtos)
  }
}
