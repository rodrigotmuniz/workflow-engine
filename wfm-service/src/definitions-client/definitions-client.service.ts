import { BadGatewayException, ConflictException, Inject, Injectable, Logger } from '@nestjs/common'
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
    const observable = this.clientProxy.send('[PATTERN]findJsonDefinitionByName', name)
    const { data } = await firstValueFrom<{ data: WorkflowDefinitionDto }>(observable)
    return data
  }
}
