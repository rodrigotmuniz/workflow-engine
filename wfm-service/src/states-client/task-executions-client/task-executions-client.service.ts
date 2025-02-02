import { Inject, Injectable, Logger } from '@nestjs/common'
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
    const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.findById', id)
    const { data } = await firstValueFrom<{ data: any }>(observable)
    return data
  }

  async findOneByTaskIdAndWfInstanceId(taskId: string, wfInstanceId: number) {
    const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.findOneByTaskIdAndWfInstanceId', { taskId, wfInstanceId })
    const { data } = await firstValueFrom<{ data: any }>(observable)
    return data
  }

  async removeDependency(id: number, taskId: string) {
    this.logger.log(`removeDependency: ${JSON.stringify({ id, taskId }, null, 2)}`)

    const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.removeDependency', { id, taskId })
    const { data } = await firstValueFrom<{ data: any }>(observable)
    return data
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
      const errorMessage = `removeDependencyByIds: ${JSON.stringify({ error }, null, 2)}`
      this.logger.error(errorMessage)

      throw new ExceptionsHandler(error)
    }
  }

  async create(createTaskExecutionDto: CreateTaskExecutionDto) {
    const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.create', createTaskExecutionDto)
    const { data } = await firstValueFrom<{ data: any }>(observable)
    return data
  }

  async updateStatus(payload: { id: number; status: Status }) {
    const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.updateStatus', payload)
    const { data } = await firstValueFrom<{ data: any }>(observable)
    return data
  }

  async update(payload: { id: number, dto: Partial<TaskExecution> }) {
    const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.update', payload)
    const { data } = await firstValueFrom<{ data: any }>(observable)
    return data
  }

  async createMany(createTaskExecutionDtos: CreateTaskExecutionDto[]) {
    const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.createMany', createTaskExecutionDtos)
    const { data } = await firstValueFrom<{ data: any }>(observable)
    return data
  }

  async createDefinitionsTask(definition: WorkflowDefinitionDto, wfInstanceId: number) {
    const executions: CreateTaskExecutionDto[] = []

    for (let task of definition.tasks) {
      const execution: CreateTaskExecutionDto = {
        taskId: task.id,
        definitionId: definition.id,
        taskAction: task.action,
        taskRetry: task.retry,
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
  }
}
