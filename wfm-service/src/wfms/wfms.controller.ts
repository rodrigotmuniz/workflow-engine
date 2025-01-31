import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { RunInWfmDto } from './dto/run-in-wfm.dto'
import { UpdateWfmDto } from './dto/update-wfm.dto'
import { WfmsService } from './wfms.service'

@Controller()
export class WfmsController {
  private readonly logger = new Logger(WfmsController.name)

  constructor(private readonly wfmsService: WfmsService) {}

  @MessagePattern('[PATTERN]wfm.run')
  run(@Payload() runInWfmDto: RunInWfmDto) {
    this.logger.log(`run(): ${JSON.stringify(runInWfmDto, null, 2)}`)

    return this.wfmsService.run(runInWfmDto)
  }
}
