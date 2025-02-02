import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { WorkflowDefinitionDto } from 'src/definitions-client/dto/wf-definition.dto'
import { Status } from '../../commons/enums/status.enum'
import { CreateTaskExecutionDto } from './dto/create-task-execution.dto'
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler'
import { UpdateDefinitionDto } from 'src/definitions-client/dto/update-definition.dto'
import { CreateDefinitionsTaskInterface } from './interfaces/create-definitions-task.interface'
import { TaskExecution } from 'src/commons/interfaces/task-execution.interface'

@Injectable()
export class TaskExecutionsClientService {
  private readonly logger = new Logger(TaskExecutionsClientService.name)

  constructor(
    @Inject(process.env.STATE_CLIENT || 'STATE_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  async findById(id: number) {
    try {
      this.logger.log(`findById: ${JSON.stringify({ id }, null, 2)}`)

      const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.findById', id)
      const { data } = await firstValueFrom<{ data: any }>(observable)
      return data
        } catch (error) {
          this.logger.error(`findById: ${JSON.stringify({ message: error.message }, null, 2)}`)
    
          throw new InternalServerErrorException(error.message || error)
        }
  }

  async findOneByTaskIdAndWfInstanceId(taskId: string, wfInstanceId: number) {
    try {
      this.logger.log(`findOneByTaskIdAndWfInstanceId: ${JSON.stringify({ taskId, wfInstanceId }, null, 2)}`)

      const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.findOneByTaskIdAndWfInstanceId', { taskId, wfInstanceId })
      const { data } = await firstValueFrom<{ data: any }>(observable)
      return data
        } catch (error) {
          this.logger.error(`findOneByTaskIdAndWfInstanceId: ${JSON.stringify({ message: error.message }, null, 2)}`)
    
          throw new InternalServerErrorException(error.message || error)
        }
  }

  async removeDependency(id: number, taskId: string) {
    try {
      this.logger.log(`removeDependency: ${JSON.stringify({ id, taskId }, null, 2)}`)
  
      const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.removeDependency', { id, taskId })
      const { data } = await firstValueFrom<{ data: any }>(observable)
      return data
        } catch (error) {
          this.logger.error(`removeDependency: ${JSON.stringify({ message: error.message }, null, 2)}`)
    
          throw new InternalServerErrorException(error.message || error)
        }
  }

  async removeDependencyByIds(taskIds: string[], wfInstanceId: number, dependencyId: string) {
    try {
        this.logger.log(`removeDependencyByIds: ${JSON.stringify({ taskIds, wfInstanceId, dependencyId }, null, 2)}`)
  
        const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.removeDependencyByIds', {
          taskIds,
          wfInstanceId,
          dependencyId,
        })
        const { data } = await firstValueFrom<{ data: any }>(observable)
        return data
          } catch (error) {
            this.logger.error(`removeDependencyByIds: ${JSON.stringify({ message: error.message }, null, 2)}`)
      
            throw new InternalServerErrorException(error.message || error)
          }
  }

  async create(createTaskExecutionDto: CreateTaskExecutionDto) {
    try {
      this.logger.log(`create: ${JSON.stringify({ createTaskExecutionDto }, null, 2)}`)

      const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.create', createTaskExecutionDto)
      const { data } = await firstValueFrom<{ data: any }>(observable)
      return data
        } catch (error) {
          this.logger.error(`create: ${JSON.stringify({ message: error.message }, null, 2)}`)
    
          throw new InternalServerErrorException(error.message || error)
        }
  }

  async updateStatus(payload: { id: number; status: Status }) {
    try {
      this.logger.log(`updateStatus: ${JSON.stringify({ payload }, null, 2)}`)

      const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.updateStatus', payload)
      const { data } = await firstValueFrom<{ data: any }>(observable)
      return data
        } catch (error) {
          this.logger.error(`updateStatus: ${JSON.stringify({ message: error.message }, null, 2)}`)
    
          throw new InternalServerErrorException(error.message || error)
        }
  }

  async update(payload: { id: number; dto: Partial<TaskExecution> }) {
    try {
      this.logger.log(`update: ${JSON.stringify({ payload }, null, 2)}`)

      const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.update', payload)
      const { data } = await firstValueFrom<{ data: any }>(observable)
      return data
        } catch (error) {
          this.logger.error(`update: ${JSON.stringify({ message: error.message }, null, 2)}`)
    
          throw new InternalServerErrorException(error.message || error)
        }
  }

  async createMany(createTaskExecutionDtos: CreateTaskExecutionDto[]) {
    try {
      this.logger.log(`createMany: ${JSON.stringify({ createTaskExecutionDtos }, null, 2)}`)

      const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.createMany', createTaskExecutionDtos)
      const { data } = await firstValueFrom<{ data: any }>(observable)
      return data
        } catch (error) {
          this.logger.error(`createMany: ${JSON.stringify({ message: error.message }, null, 2)}`)
    
          throw new InternalServerErrorException(error.message || error)
        }
  }

  async createDefinitionsTask(definition: WorkflowDefinitionDto, wfInstanceId: number) {
    try {
      this.logger.log(`createDefinitionsTask: ${JSON.stringify({ definition, wfInstanceId }, null, 2)}`)

      const executions: CreateTaskExecutionDto[] = []
  
      for (let task of definition.tasks) {
        const execution: CreateTaskExecutionDto = {
          taskId: task.id,
          definitionId: definition.id,
          taskAction: task.action,
          taskRetry: task.retry,
          taskRetryInterval: task.retryInterval,
          taskService: task.service,
          taskTimeout: task.timeout,
          taskType: task.type,
          wfInstanceId,
          dependencies: [],
          onFailure: [],
          onSuccess: [],
          status: Status.PENDING,
        }
        for (let transition of definition.transitions) {
          const { from, to, onFailure, onSuccess } = transition
  
          if (to.includes(task.id)) {
            execution.dependencies.push(...from)
          }
          if (from.includes(task.id)) {
            if (onSuccess) {
              execution.onSuccess.push(...to)
            } else if (onFailure) {
              execution.onFailure.push(...to)
            }
          }
        }
        executions.push(execution)
      }
  
      const savedExecutions = await this.createMany(executions)
  
      return savedExecutions
        } catch (error) {
          this.logger.error(`createDefinitionsTask: ${JSON.stringify({ message: error.message }, null, 2)}`)
    
          throw new InternalServerErrorException(error.message || error)
        }
  }
}
