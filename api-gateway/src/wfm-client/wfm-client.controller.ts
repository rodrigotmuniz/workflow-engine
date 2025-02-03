import { Body, Controller, Get, Inject, Logger, Param, Post, UseGuards } from '@nestjs/common'
import { ClientProxy, Payload } from '@nestjs/microservices'
import { RunDto } from './dto/run.dto'
import { JwtAuthGuard } from 'src/commons/auth/guards/jwt.guard'
import { Roles } from 'src/commons/auth/decorators/roles.decorator'
import { ROLES } from 'src/commons/auth/enums/roles.enum'

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
}
