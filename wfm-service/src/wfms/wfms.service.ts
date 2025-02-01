import { Injectable, Logger } from '@nestjs/common'
import { DefinitionsClientService } from 'src/definitions-client/definitions-client.service'
import { TaskExecutionsClientService } from 'src/states-client/task-executions-client/task-executions-client.service'
import { WfInstancesClientService } from 'src/states-client/wf-instances-client/wf-instances-client.service'
import { RunInWfmDto } from './dto/run-in-wfm.dto'

@Injectable()
export class WfmsService {
  private readonly logger = new Logger(WfmsService.name)
  constructor(
    private readonly definitionsClientService: DefinitionsClientService,
    private readonly wfInstancesClientService: WfInstancesClientService,
    private readonly taskExecutionsClientService: TaskExecutionsClientService,
  ) {}

  async run(runInWfmDto: RunInWfmDto) {
    this.logger.log('run()')

    const definition = await this.definitionsClientService.findJsonDefinitionByName(runInWfmDto.name)
    const wfInstance = await this.wfInstancesClientService.createByDefinition(definition)
    const taskExecutions = await this.taskExecutionsClientService.createDefinitionsTask(definition, wfInstance.id)

    // - [ ]  Validate: [TASK_QUEUE]
    // - [ ]  all task executors exists [TASK_QUEUE]
    // - [ ]  task executors' dto are mapped [TASK_QUEUE]

    return taskExecutions
  }
}
