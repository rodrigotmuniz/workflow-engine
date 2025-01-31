import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateWfInstanceDto } from './dto/create-wf-instance.dto'
import { WfInstancesService } from './wf-instances.service'

@Controller()
export class WfInstancesController {
  private readonly logger = new Logger(WfInstancesController.name)

  constructor(private readonly wfInstancesService: WfInstancesService) {}

  @MessagePattern('[PATTERN]WfInstancesController.create')
  create(@Payload() createWfInstanceDto: CreateWfInstanceDto) {
    this.logger.log('create()')
    return this.wfInstancesService.create(createWfInstanceDto)
  }
}
