import { Injectable, Logger } from '@nestjs/common'
import { DefinitionsClientService } from 'src/definitions-client/definitions-client.service'
import { TaskExecutionsClientService } from 'src/states-client/task-executions-client/task-executions-client.service'
import { WfInstancesClientService } from 'src/states-client/wf-instances-client/wf-instances-client.service'
import { EventEmitterService } from './services/event-emitter.service'
import { TaskEventEmitter } from './services/task-event-emitter.service'

@Injectable()
export class WfmsService {
  private readonly logger = new Logger(WfmsService.name)
  constructor(
    private readonly definitionsClientService: DefinitionsClientService,
    private readonly wfInstancesClientService: WfInstancesClientService,
    private readonly taskExecutionsClientService: TaskExecutionsClientService,
    private readonly taskQueuesService: EventEmitterService,
    private readonly taskEventEmitter: TaskEventEmitter,
  ) {}

  async run(definitionId: string) {
    this.logger.log('run()')

    // this.taskEventEmitter.onTaskCompleted('bla', 'ble', (data) => console.log(1111111111, data))

    const taskExecutions = await this.creteInitialState(definitionId)
    const initialExecutions = this.getInitialExecutions(taskExecutions)
    // const queue = await this.taskQueuesService.find()

    const tasksPromises = initialExecutions.map((execution) => this.taskQueuesService.emitEvent(execution.taskId, execution))
    const response = await Promise.all(tasksPromises)

    return { response, initialExecutions }
    // return queue
  }

  private async creteInitialState(definitionId: string) {
    const definition = await this.definitionsClientService.findJsonDefinitionByName(definitionId)
    const wfInstance = await this.wfInstancesClientService.createByDefinition(definition)
    const taskExecutions = await this.taskExecutionsClientService.createDefinitionsTask(definition, wfInstance.id)
    return taskExecutions
  }

  private getInitialExecutions(taskExecutions) {
    const initialExecutions = taskExecutions.filter((execution) => !execution.dependencies.length)
    return initialExecutions
  }

  async initTasks(initTaskIds: number, fromTaskId: string, wfInstanceId: number) {
    this.logger.log(`initTasks: ${JSON.stringify({ initTaskIds, fromTaskId, wfInstanceId }, null, 2)}`)

    const initTaskId = initTaskIds[0] // ! TODO: Passar para array a chamada abaixo
    const taskExecution = await this.taskExecutionsClientService.findOneByTaskIdAndWfInstanceId(initTaskId, wfInstanceId)

    this.logger.debug(`taskExecution: ${JSON.stringify(taskExecution, null, 2)}`)

    const removed = await this.taskExecutionsClientService.removeDependency(taskExecution.id,fromTaskId)
    return removed
  }
}
