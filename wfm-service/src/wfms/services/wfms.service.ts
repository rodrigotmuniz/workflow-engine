import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { CurrentStatusType } from 'src/commons/enums/currentStatusType.enum'
import { Status } from 'src/commons/enums/status.enum'
import { DefinitionsClientService } from 'src/definitions-client/definitions-client.service'
import { TaskExecutionsClientService } from 'src/states-client/task-executions-client/task-executions-client.service'
import { WfInstancesClientService } from 'src/states-client/wf-instances-client/wf-instances-client.service'
import { TaskExecutionEntity } from '../../commons/entities/task-execution.entity'
import { TaskQueuesClientService } from '../../task-queues-client/task-queues-client.service'
import { RunDto } from '../dto/run.dto'
import { TaskExecution } from 'src/commons/interfaces/task-execution.interface'
import { LogsClientService } from 'src/logs-client/logs-client.service'

@Injectable()
export class WfmsService {
  private readonly logger = new Logger(WfmsService.name)
  constructor(
    private readonly definitionsClientService: DefinitionsClientService,
    private readonly wfInstancesClientService: WfInstancesClientService,
    private readonly taskExecutionsClientService: TaskExecutionsClientService,
    private readonly taskQueuesClientService: TaskQueuesClientService,
    private readonly logsClientService: LogsClientService,
  ) {}

  async run({ body, definitionName }: RunDto) {
    try {
      this.logger.log(`run: ${JSON.stringify({ definitionName, body }, null, 2)}`)

      const taskExecutions = await this.creteInitialState(definitionName)
      const initialExecutions = this.getInitialExecutions(taskExecutions)

      await this.wfInstancesClientService.updateState({
        id: initialExecutions[0].wfInstanceId,
        status: Status.IN_PROGRESS,
      })

      this.initialInitTasks(initialExecutions, body)

      return { message: 'Initial events emitted.' }
    } catch (error) {
      this.logger.error(`run: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  private async creteInitialState(definitionId: string) {
    try {
      this.logger.log(`creteInitialState: ${JSON.stringify({ definitionId }, null, 2)}`)

      const definition = await this.definitionsClientService.findJsonDefinitionByName(definitionId)
      const wfInstance = await this.wfInstancesClientService.createByDefinition(definition)
      const taskExecutions = await this.taskExecutionsClientService.createDefinitionsTask(definition, wfInstance.id)
      return taskExecutions
    } catch (error) {
      this.logger.error(`creteInitialState: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  private getInitialExecutions(taskExecutions: TaskExecution[]) {
    try {
      this.logger.log(`getInitialExecutions: ${JSON.stringify({ taskExecutions }, null, 2)}`)

      const initialExecutions = taskExecutions.filter((execution) => !execution.dependencies.length)
      return initialExecutions
    } catch (error) {
      this.logger.error(`getInitialExecutions: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async initTasks(initTaskIds: string[], fromTaskId: string, wfInstanceId: number, input: Record<string, any>) {
    try {
      this.logger.log(`initTasks: ${JSON.stringify({ initTaskIds, fromTaskId, wfInstanceId }, null, 2)}`)

      const updatedTaskExecutions = await this.taskExecutionsClientService.removeDependencyByIds(initTaskIds, wfInstanceId, fromTaskId)

      for (let updatedTaskExecution of updatedTaskExecutions) {
        this.initTask(updatedTaskExecution, input)
      }
      return updatedTaskExecutions
    } catch (error) {
      this.logger.error(`initTasks: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async initialInitTasks(initialExecutions: TaskExecution[], input: Record<string, any>) {
    try {
      this.logger.log(`initialInitTasks: ${JSON.stringify({ initialExecutions }, null, 2)}`)

      for (let initialExecution of initialExecutions) {
        this.initTask(initialExecution, input)
      }
    } catch (error) {
      this.logger.error(`initialInitTasks: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  private async initTask(taskExecution: TaskExecution, input: Record<string, any>) {
    try {
      this.logger.log(`initTask: ${JSON.stringify({ taskExecution }, null, 2)}`)

      this.logsClientService.emitInProgress(taskExecution)

      if (taskExecution.dependencies.length) {
        await this.taskExecutionsClientService.updateStatus({ id: taskExecution.id, status: Status.WAITING_FOR_DEPENDENCY })
        this.logsClientService.emitWaitingForPendencies(taskExecution)
      } else {
        await this.taskExecutionsClientService.update({
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

        this.taskQueuesClientService.emitEvent(taskExecution.taskId, taskExecution)
      }
    } catch (error) {
      this.logger.error(`initTask: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async completeTask(taskExecution: TaskExecutionEntity, success: boolean) {
    try {
      this.logger.log(`completeTask: ${JSON.stringify({ taskExecution }, null, 2)}`)

      await this.taskExecutionsClientService.update({
        id: taskExecution.id,
        dto: {
          status: success ? Status.SUCCEEDED : Status.FAILED,
          output: taskExecution.output,
        },
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
      this.logsClientService.emitComplete(taskExecution, success)
    } catch (error) {
      this.logger.error(`completeTask: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }
}
