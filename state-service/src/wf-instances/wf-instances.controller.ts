import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateWfInstanceDto } from './dto/create-wf-instance.dto'
import { WfInstancesService } from './services/wf-instances.service'
import { Status } from './enums/status.enum'
import { CurrentStatusType } from './enums/currentStatusType.enum'

@Controller()
export class WfInstancesController {
  private readonly logger = new Logger(WfInstancesController.name)

  constructor(private readonly wfInstancesService: WfInstancesService) {}

  @MessagePattern('[PATTERN]WfInstancesController.create')
  create(@Payload() createWfInstanceDto: CreateWfInstanceDto) {
    this.logger.log(`create: ${JSON.stringify({ createWfInstanceDto }, null, 2)}`)

    return this.wfInstancesService.create(createWfInstanceDto)
  }

  @MessagePattern('[PATTERN]WfInstancesController.updateState')
  updateState(@Payload() payload: { id: number; status: Status }) {
    this.logger.log(`updateState: ${JSON.stringify({ payload }, null, 2)}`)

    const { id, status } = payload
    return this.wfInstancesService.updateState(id, status)
  }

  @MessagePattern('[PATTERN]WfInstancesController.updateCurrentState')
  updateCurrentState(@Payload() payload: { id: number; taskId: string; type: CurrentStatusType }) {
    this.logger.log(`updateCurrentState: ${JSON.stringify({ payload }, null, 2)}`)

    const { id, taskId, type } = payload
    return this.wfInstancesService.updateCurrentState(id, taskId, type)
  }
}
