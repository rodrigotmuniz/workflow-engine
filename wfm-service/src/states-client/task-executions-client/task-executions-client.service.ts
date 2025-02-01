import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { WorkflowDefinitionDto } from 'src/definitions-client/dto/wf-definition.dto'
import { CreateTaskExecutionDto } from './dto/create-task-execution.dto'
import { Status } from '../enums/status.enum'

@Injectable()
export class TaskExecutionsClientService {
  private readonly logger = new Logger(TaskExecutionsClientService.name)

  constructor(
    @Inject(process.env.STATE_CLIENT || 'STATE_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  async create(createTaskExecutionDto: CreateTaskExecutionDto) {
    const observable = this.clientProxy.send('[PATTERN]TaskExecutionsController.create', createTaskExecutionDto)
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
