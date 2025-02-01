import { Injectable, Logger } from '@nestjs/common'
import { DefinitionsClientService } from 'src/definitions-client/definitions-client.service'
import { TaskExecutionsClientService } from 'src/states-client/task-executions-client/task-executions-client.service'
import { WfInstancesClientService } from 'src/states-client/wf-instances-client/wf-instances-client.service'
import { TaskQueuesClientService } from '../../task-queues-client/task-queues-client.service'
import { TaskExecution } from '../../commons/entities/task-execution.entity'

@Injectable()
export class WfmsService {
  private readonly logger = new Logger(WfmsService.name)
  constructor(
    private readonly definitionsClientService: DefinitionsClientService,
    private readonly wfInstancesClientService: WfInstancesClientService,
    private readonly taskExecutionsClientService: TaskExecutionsClientService,
    private readonly taskQueuesClientService: TaskQueuesClientService,
  ) {}

  async run(definitionId: string) {
    this.logger.log(`run: ${JSON.stringify({ definitionId }, null, 2)}`)

    const taskExecutions = await this.creteInitialState(definitionId)
    const initialExecutions = this.getInitialExecutions(taskExecutions)
    await this.taskQueuesClientService.emitEvents(initialExecutions)

    return { message: 'Initial events emitted.' }
  }

  private async creteInitialState(definitionId: string) {
    this.logger.log(`creteInitialState: ${JSON.stringify({ definitionId }, null, 2)}`)

    const definition = await this.definitionsClientService.findJsonDefinitionByName(definitionId)
    const wfInstance = await this.wfInstancesClientService.createByDefinition(definition)
    const taskExecutions = await this.taskExecutionsClientService.createDefinitionsTask(definition, wfInstance.id)
    return taskExecutions
  }

  private getInitialExecutions(taskExecutions) {
    this.logger.log(`getInitialExecutions: ${JSON.stringify({ taskExecutions }, null, 2)}`)

    const initialExecutions = taskExecutions.filter((execution) => !execution.dependencies.length)
    return initialExecutions
  }

  async initTasks(initTaskIds: string[], fromTaskId: string, wfInstanceId: number) {
    this.logger.log(`initTasks: ${JSON.stringify({ initTaskIds, fromTaskId, wfInstanceId }, null, 2)}`)

    const updatedTaskExecutions = await this.taskExecutionsClientService.removeDependencyByIds(initTaskIds, wfInstanceId, fromTaskId)
    this.logger.debug(`updatedTasks: ${JSON.stringify(updatedTaskExecutions, null, 2)}`)

    for (let updatedTaskExecution of updatedTaskExecutions) {
      this.initTask(updatedTaskExecution)
    }
    // const removed = await this.taskExecutionsClientService.removeDependency(taskExecution.id, fromTaskId)
    return updatedTaskExecutions
  }

  private initTask(taskExecution: TaskExecution) {
    this.logger.log(`initTask: ${JSON.stringify({taskExecution }, null, 2)}`)

    if (taskExecution.dependencies.length) {
      // criar evento e bla
      console.log()
    } else {
      this.taskQueuesClientService.emitEvent(taskExecution.taskId, taskExecution)
    }
  }

  // {
  //   "id": 672,
  //   "definitionId": "order_processing",
  //   "status": "PENDING",
  //   "wf_instance_id": 125,
  //   "dependencies": [],
  //   "taskId": "B",
  //   "taskType": "database_query",
  //   "taskService": "inventory-service",
  //   "taskAction": "check_stock",
  //   "taskRetry": 2,
  //   "taskTimeout": 3000,
  //   "onFailure": "E",
  //   "onSuccess": "C,D",
  //   "input": null,
  //   "output": null
  // }
 
}
