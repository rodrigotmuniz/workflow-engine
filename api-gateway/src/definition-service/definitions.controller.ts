import { Controller, Get, Inject, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Controller('definitions')
export class DefinitionsController {
  private readonly logger = new Logger(DefinitionsController.name)

  constructor(
    @Inject(process.env.DEFINITION_CLIENT || 'DEFINITION_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  @Get()
  findAll() {
    this.logger.log('findAll()')
    return this.clientProxy.send('DefinitionsController', {})
  }
}
