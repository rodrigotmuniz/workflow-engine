import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTaskExecutionDto } from './dto/create-task-execution.dto'
import { TaskExecution } from './entities/task-execution.entity'

@Injectable()
export class TaskExecutionsService {
  private readonly logger = new Logger(TaskExecutionsService.name)

  constructor(
    @InjectRepository(TaskExecution)
    private readonly repository: Repository<TaskExecution>,
  ) {}

  async create(createTaskExecutionDto: CreateTaskExecutionDto) {
    this.logger.log('Creating new taskExecution...')

    const newTaskExecution = this.repository.create(createTaskExecutionDto)
    const saveTaskExecution = await this.repository.save(newTaskExecution)

    this.logger.log(`taskExecution created with ID: ${saveTaskExecution.id}`)
    return saveTaskExecution
  }


  async createMany(createTaskExecutionDtos: CreateTaskExecutionDto[]) {
    this.logger.log(`createMany(): ${JSON.stringify(createTaskExecutionDtos, null, 2)}`)

    const newTaskExecutions = createTaskExecutionDtos.map(createTaskExecutionDto => this.repository.create(createTaskExecutionDto))
    const saveTaskExecutions = await this.repository.save(newTaskExecutions)

    this.logger.log(`taskExecutions created with IDs: ${saveTaskExecutions.map(e => e.id)}`)
    return saveTaskExecutions
  }
}
