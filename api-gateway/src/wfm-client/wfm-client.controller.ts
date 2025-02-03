import { Body, Controller, Inject, Logger, Param, Post, UseGuards } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { RunDto } from './dto/run.dto'
import { JwtAuthGuard } from 'src/commons/auth/guards/jwt.guard'
import { Roles } from 'src/commons/auth/decorators/roles.decorator'
import { ROLES } from 'src/commons/auth/enums/roles.enum'
import { WfmPattern } from '@rodrigotmuniz/celito-workflow-engine'

@Controller('wfm')
export class WfmClientController {
  private readonly logger = new Logger(WfmClientController.name)

  constructor(
    @Inject(process.env.WFM_CLIENT || 'WFM_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  @Post('run/:definitionName')
  @Roles([ROLES.ADMIN, ROLES.USER])
  @UseGuards(JwtAuthGuard)
  run(@Param('definitionName') definitionName: string, @Body() body: Record<string, any>) {
    this.logger.log(`run: ${JSON.stringify({ definitionName, body }, null, 2)}`)

    const payload: RunDto = { definitionName, body }
    return this.clientProxy.send(WfmPattern.RUN, payload)
  }
}
