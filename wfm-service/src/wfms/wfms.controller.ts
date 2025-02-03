import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { WfmsService } from './services/wfms.service'
import { RunDto } from './dto/run.dto'
import { WfmPattern } from '@rodrigotmuniz/celito-workflow-engine'

@Controller()
export class WfmsController {
  private readonly logger = new Logger(WfmsController.name)

  constructor(private readonly wfmsService: WfmsService) {}

  @MessagePattern(WfmPattern.RUN)
  run(@Payload() payload: RunDto) {
    this.logger.log(`run: ${JSON.stringify(payload, null, 2)}`)

    return this.wfmsService.run(payload)
  }
}
