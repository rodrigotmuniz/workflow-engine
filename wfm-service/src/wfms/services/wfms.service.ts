import { Injectable, Logger } from '@nestjs/common'
import { CurrentStatusType } from 'src/commons/enums/currentStatusType.enum'
import { Status } from 'src/commons/enums/status.enum'
import { DefinitionsClientService } from 'src/definitions-client/definitions-client.service'
import { TaskExecutionsClientService } from 'src/states-client/task-executions-client/task-executions-client.service'
import { WfInstancesClientService } from 'src/states-client/wf-instances-client/wf-instances-client.service'
import { TaskExecutionEntity } from '../../commons/entities/task-execution.entity'
import { TaskQueuesClientService } from '../../task-queues-client/task-queues-client.service'
import { RunDto } from '../dto/run.dto'
import { TaskExecution } from 'src/commons/interfaces/task-execution.interface'

@Injectable()
export class WfmsService {
  private readonly logger = new Logger(WfmsService.name)
  constructor(
    private readonly definitionsClientService: DefinitionsClientService,
    private readonly wfInstancesClientService: WfInstancesClientService,
    private readonly taskExecutionsClientService: TaskExecutionsClientService,
    private readonly taskQueuesClientService: TaskQueuesClientService,
  ) {}

  async run({ body, definitionName }: RunDto) {
    this.logger.log(`run: ${JSON.stringify({ definitionName, body }, null, 2)}`)

    const taskExecutions = await this.creteInitialState(definitionName)
    const initialExecutions = this.getInitialExecutions(taskExecutions)

    await this.wfInstancesClientService.updateState({
      id: initialExecutions[0].wfInstanceId,
      status: Status.IN_PROGRESS,
    })

    this.initialInitTasks(initialExecutions, body)

    return { message: 'Initial events emitted.' } 
  }

  private async creteInitialState(definitionId: string) {
    this.logger.log(`creteInitialState: ${JSON.stringify({ definitionId }, null, 2)}`)

    const definition = await this.definitionsClientService.findJsonDefinitionByName(definitionId)
    const wfInstance = await this.wfInstancesClientService.createByDefinition(definition)
    const taskExecutions = await this.taskExecutionsClientService.createDefinitionsTask(definition, wfInstance.id)
    return taskExecutions
  }

  private getInitialExecutions(taskExecutions: TaskExecution[]) {
    this.logger.log(`getInitialExecutions: ${JSON.stringify({ taskExecutions }, null, 2)}`)

    const initialExecutions = taskExecutions
      .filter((execution) => !execution.dependencies.length)
      // .map((execution) => ({
      //   ...execution,
      //   input: inputBody,
      // }))
    return initialExecutions
  }

  async initTasks(initTaskIds: string[], fromTaskId: string, wfInstanceId: number, input: Record<string, any>) {
    this.logger.log(`initTasks: ${JSON.stringify({ initTaskIds, fromTaskId, wfInstanceId }, null, 2)}`)

    const updatedTaskExecutions = await this.taskExecutionsClientService.removeDependencyByIds(initTaskIds, wfInstanceId, fromTaskId)
    this.logger.debug(`updatedTasks: ${JSON.stringify(updatedTaskExecutions, null, 2)}`)

    for (let updatedTaskExecution of updatedTaskExecutions) {
      this.initTask(updatedTaskExecution, input)
    }
    return updatedTaskExecutions
  }

  async initialInitTasks(initialExecutions: TaskExecution[], input: Record<string, any>) {
    this.logger.log(`initialInitTasks: ${JSON.stringify({ initialExecutions }, null, 2)}`)

    for (let initialExecution of initialExecutions) {
      this.initTask(initialExecution, input)
    }
  }

  private async initTask(taskExecution: TaskExecution, input: Record<string, any>) {
    this.logger.log(`initTask: ${JSON.stringify({ taskExecution }, null, 2)}`)

    if (taskExecution.dependencies.length) {
      await this.taskExecutionsClientService.updateStatus({ id: taskExecution.id, status: Status.WAITING_FOR_DEPENDENCY })
    } else {
      const updateStatus = await this.taskExecutionsClientService.update({
        id: taskExecution.id,
        dto: {
          status: Status.IN_PROGRESS,
          input,
        },
      })

      await this.wfInstancesClientService.updateCurrentState({
        id: taskExecution.wfInstanceId,
        taskId: taskExecution.taskId,
        type: CurrentStatusType.APPEND,
      })

      this.logger.debug(`updateStatus: ${JSON.stringify({ updateStatus }, null, 2)}`)

      this.taskQueuesClientService.emitEvent(taskExecution.taskId, taskExecution)
    }
  }

  async completeTask(taskExecution: TaskExecutionEntity, success: boolean) {
    this.logger.log(`completeTask: ${JSON.stringify({ taskExecution }, null, 2)}`)

    await this.taskExecutionsClientService.update({
      id: taskExecution.id,
      dto: {
        status: success ? Status.SUCCEEDED : Status.FAILED,
        output: taskExecution.output
      }
    })

    await this.wfInstancesClientService.updateCurrentState({
      id: taskExecution.wfInstanceId,
      taskId: taskExecution.taskId,
      type: CurrentStatusType.REMOVE,
    })

    if (!taskExecution.onSuccess.length && !taskExecution.onFailure.length) {
      await this.wfInstancesClientService.updateState({
        id: taskExecution.wfInstanceId,
        status: success ? Status.SUCCEEDED : Status.FAILED,
      })
    }
  }
}
