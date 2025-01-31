import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { CreateWfInstanceDto } from './dto/create-wf-instance.dto'
import { WorkflowDefinitionDto } from 'src/definitions-client/dto/wf-definition.dto'
import { Status } from './enums/status.enum'

@Injectable()
export class WfInstancesClientService {
  private readonly logger = new Logger(WfInstancesClientService.name)

  constructor(
    @Inject(process.env.STATE_CLIENT || 'STATE_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  async create(createWfInstanceDto: CreateWfInstanceDto) {
    const observable = this.clientProxy.send('[PATTERN]WfInstancesController.create', createWfInstanceDto)
    const data = await firstValueFrom<{ data: boolean }>(observable)
    return data
  }

  async createByDefinition(definition: WorkflowDefinitionDto) {
    const currentState = definition.tasks[0].id
    const wfInstance = await this.create({
      currentStates: [currentState],
      definitionId: definition.id,
      status: Status.PENDING,
    })
    return wfInstance
  }
}
