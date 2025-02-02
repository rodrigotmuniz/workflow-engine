import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTaskExecutionDto } from './dto/create-task-execution.dto'
import { TaskExecution } from './entities/task-execution.entity'
import { Status } from './enums/status.enum'
import { UpdateTaskExecutionDto } from './dto/update-task-execution.dto'

@Injectable()
export class TaskExecutionsService {
  private readonly logger = new Logger(TaskExecutionsService.name)

  constructor(
    @InjectRepository(TaskExecution)
    private readonly repository: Repository<TaskExecution>,
  ) {}

  async create(createTaskExecutionDto: CreateTaskExecutionDto) {
    try {
      this.logger.log(`create: ${JSON.stringify({ createTaskExecutionDto }, null, 2)}`)

      const newTaskExecution = this.repository.create(createTaskExecutionDto)
      const saveTaskExecution = await this.repository.save(newTaskExecution)

      return saveTaskExecution
    } catch (error) {
      this.logger.error(`create: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async createMany(createTaskExecutionDtos: CreateTaskExecutionDto[]) {
    try {
      this.logger.log(`createMany: ${JSON.stringify({ createTaskExecutionDtos }, null, 2)}`)

      const newTaskExecutions = createTaskExecutionDtos.map((createTaskExecutionDto) => this.repository.create(createTaskExecutionDto))
      const saveTaskExecutions = await this.repository.save(newTaskExecutions)

      return saveTaskExecutions
    } catch (error) {
      this.logger.error(`createMany: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async findById(id: number) {
    try {
      this.logger.log(`findById: ${JSON.stringify({ id }, null, 2)}`)

      return this.repository.findOneBy({ id })
    } catch (error) {
      this.logger.error(`findById: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async updateStatus(id: number, status: Status) {
    try {
      this.logger.log(`updateStatus: ${JSON.stringify({ id, status }, null, 2)}`)

      const updatedTaskExecution = await this.repository.update({ id }, { status })
      return updatedTaskExecution
    } catch (error) {
      this.logger.error(`updateStatus: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async update(id: number, dto: UpdateTaskExecutionDto) {
    try {
      this.logger.log(`update: ${JSON.stringify({ id, dto }, null, 2)}`)

      const updatedTaskExecution = await this.repository.update({ id }, dto)
      return updatedTaskExecution
    } catch (error) {
      this.logger.error(`update: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async findOneByTaskIdAndWfInstanceId(taskId: string, wfInstanceId: number) {
    try {
      this.logger.log(`findOneByTaskIdAndWfInstanceId: ${JSON.stringify({ taskId, wfInstanceId }, null, 2)}`)

      return this.repository.findOneBy({ taskId, wfInstanceId })
    } catch (error) {
      this.logger.error(`findOneByTaskIdAndWfInstanceId: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
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
      this.logger.error(`removeDependency: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async removeDependencyByIds(taskIds: string[], wfInstanceId: number, dependencyId: string) {
    try {
      this.logger.log(`removeDependencyByIds: ${JSON.stringify({ taskIds, wfInstanceId, dependencyId }, null, 2)}`)

      if (!taskIds.length) return []

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
      const updatedExecution = result.raw
      return updatedExecution
    } catch (error) {
      this.logger.error(`removeDependencyByIds: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }
}
