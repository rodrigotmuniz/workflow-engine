import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, QueryFailedError, Repository } from 'typeorm'
import { CreateTaskExecutionDto } from './dto/create-task-execution.dto'
import { TaskExecution } from './entities/task-execution.entity'
import { plainToClass } from 'class-transformer'

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

    const newTaskExecutions = createTaskExecutionDtos.map((createTaskExecutionDto) => this.repository.create(createTaskExecutionDto))
    const saveTaskExecutions = await this.repository.save(newTaskExecutions)

    this.logger.log(`taskExecutions created with IDs: ${saveTaskExecutions.map((e) => e.id)}`)
    return saveTaskExecutions
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id })
  }
  async findOneByTaskIdAndWfInstanceId(taskId: string, wfInstanceId: number) {
    return this.repository.findOneBy({ taskId, wfInstanceId })
  }

  async removeDependency(id: number, dependencyId: string) {
    try {
    this.logger.log(`removeDependency: ${JSON.stringify({ id, dependencyId }, null, 2)}`)

      const result = await this.repository
        .createQueryBuilder()
        .update(TaskExecution)
        .set({
          dependencies: () => `array_remove(dependencies, '${dependencyId}')`,
        })
        .where('id = :id', { id })
        .returning('*')
        .execute()

      const updatedExecution = result.raw[0]
      return updatedExecution
    } catch (error) {
      const errorMessage = `removeDependency: ${JSON.stringify({ error }, null, 2)}`
      this.logger.log(errorMessage)

      throw new Error(errorMessage) // ! TODO: Improve it
    }
  }

  async removeDependencyByIds(taskIds: string[], wfInstanceId: number, dependencyId: string) {
    try {
      this.logger.log(`removeDependencyByIds: ${JSON.stringify({ taskIds, wfInstanceId, dependencyId }, null, 2)}`)

      const result = await this.repository
        .createQueryBuilder()
        .update(TaskExecution)
        .set({
          dependencies: () => `array_remove(dependencies, '${dependencyId}')`,
        })
        .where(' taskId IN (:...taskIds)  AND wfInstanceId = :wfInstanceId  AND :dependencyId = ANY(dependencies) ', {
          taskIds,
          wfInstanceId,
          dependencyId,
        })
        .returning('*')
        .execute()

        

      this.logger.debug(`result: ${JSON.stringify({ result }, null, 2)}`)
      const updatedExecution = plainToClass(CreateTaskExecutionDto, result.raw);
      this.logger.debug(`updatedExecution: ${JSON.stringify({ updatedExecution }, null, 2)}`)
      return updatedExecution
    } catch (error) {
      const errorMessage = `removeDependencyByIds: ${JSON.stringify({ error }, null, 2)}`
      this.logger.error(errorMessage)

      throw new Error(errorMessage) // ! TODO: Improve it
    }
  }
}
