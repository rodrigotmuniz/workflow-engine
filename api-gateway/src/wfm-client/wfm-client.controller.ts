import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Controller('wfm')
export class WfmClientController {
  private readonly logger = new Logger(WfmClientController.name)

  constructor(
    @Inject(process.env.WFM_CLIENT || 'WFM_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  @Post('run')
  run(@Body() dto: any) {
    this.logger.log(`run(@Body() ${dto}: any)`)

    return this.clientProxy.send('[PATTERN]wfm.run', dto)
  }
}
