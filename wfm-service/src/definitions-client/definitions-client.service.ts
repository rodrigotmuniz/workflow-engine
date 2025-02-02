import { BadGatewayException, ConflictException, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { WorkflowDefinitionDto } from './dto/wf-definition.dto'

@Injectable()
export class DefinitionsClientService {
  private readonly logger = new Logger(DefinitionsClientService.name)

  constructor(
    @Inject(process.env.DEFINITION_CLIENT || 'DEFINITION_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  async findJsonDefinitionByName(name: string) {
    try {
      this.logger.log(`findJsonDefinitionByName: ${JSON.stringify({ name }, null, 2)}`)

      const observable = this.clientProxy.send('[PATTERN]findJsonDefinitionByName', name)
      const { data } = await firstValueFrom<{ data: WorkflowDefinitionDto }>(observable)
      return data
    } catch (error) {
      this.logger.error(`findJsonDefinitionByName: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }
}
