import { Injectable, Logger } from '@nestjs/common'
import { DefinitionsClientService } from 'src/definitions-client/definitions-client.service'
import { RunInWfmDto } from './dto/run-in-wfm.dto'
import { WfInstancesClientService } from 'src/states-client/wf-instances-client/wf-instances-client.service'
import { Status } from 'src/states-client/wf-instances-client/enums/status.enum'

@Injectable()
export class WfmsService {
  private readonly logger = new Logger(WfmsService.name)
  constructor(
    private readonly definitionsClientService: DefinitionsClientService,
    private readonly wfInstancesClientService: WfInstancesClientService,
  ) {}

  async run(runInWfmDto: RunInWfmDto) {
    this.logger.log('run()')

    const definition = await this.definitionsClientService.findJsonDefinitionByName(runInWfmDto.name)
    const wfInstance = await this.wfInstancesClientService.createByDefinition(definition)

    // - [ ]  Validate: [TASK_QUEUE]
    // - [ ]  all task executors exists [TASK_QUEUE]
    // - [ ]  task executors' dto are mapped [TASK_QUEUE]

    return wfInstance
  }
}
