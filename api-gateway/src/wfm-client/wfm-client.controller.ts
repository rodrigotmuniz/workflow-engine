import { Controller, Get, Inject, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Controller('wfm')
export class WfmClientController {
  private readonly logger = new Logger(WfmClientController.name)

  constructor(
    @Inject(process.env.WFM_CLIENT || 'WFM_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  @Get()
  findAll() {
    this.logger.log('findAll()')
    return this.clientProxy.send('findAllWfms', {})
  }
}
