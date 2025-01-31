import { Injectable, Logger } from '@nestjs/common'
import { DefinitionsClientService } from 'src/definitions-client/definitions-client.service'
import { RunInWfmDto } from './dto/run-in-wfm.dto'
import { UpdateWfmDto } from './dto/update-wfm.dto'

@Injectable()
export class WfmsService {
  private readonly logger = new Logger(WfmsService.name)
  constructor(private readonly definitionsClientService: DefinitionsClientService) {}

  async run(runInWfmDto: RunInWfmDto) {
    this.logger.log('run()')

    const definition = await this.definitionsClientService.findJsonDefinitionByName(runInWfmDto.name)
    // - [ ]  Validate: [TASK_QUEUE]
    // - [ ]  all task executors exists [TASK_QUEUE]
    // - [ ]  task executors' dto are mapped [TASK_QUEUE]

    return definition
  }
}
