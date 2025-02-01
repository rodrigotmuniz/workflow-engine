import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { WfmsService } from './services/wfms.service'

@Controller()
export class WfmsController {
  private readonly logger = new Logger(WfmsController.name)

  constructor(private readonly wfmsService: WfmsService) {}

  @MessagePattern('[PATTERN]wfm.run')
  run(@Payload() payload: { definitionId: string }) {
    this.logger.log(`run: ${JSON.stringify(payload, null, 2)}`)

    const { definitionId } = payload
    return this.wfmsService.run(definitionId)
  }
}
