import { Body, Controller, Get, Inject, Logger, Param, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { RunDto } from './dto/run.dto'

@Controller('wfm')
export class WfmClientController {
  private readonly logger = new Logger(WfmClientController.name)

  constructor(
    @Inject(process.env.WFM_CLIENT || 'WFM_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  @Post('run/:definitionName')
  run(@Param('definitionName') definitionName: string, @Body() body: Record<string, any>) {
    this.logger.log(`run: ${JSON.stringify({ definitionName, body }, null, 2)}`)

    const payload: RunDto = { definitionName, body }
    return this.clientProxy.send('[PATTERN]wfm.run', payload)
  }

  @Get()
  bla() {
    return this.clientProxy.send('AuthPattern.CREATE', {})
  }
}
