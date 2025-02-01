import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { WorkflowDefinitionDto } from 'src/definitions-client/dto/wf-definition.dto'
import { Status } from '../../commons/enums/status.enum'
import { CreateWfInstanceDto } from './dto/create-wf-instance.dto'
import { WfInstance } from './entities/wf-instance.entity'
import { CurrentStatusType } from '../../commons/enums/currentStatusType.enum'

@Injectable()
export class WfInstancesClientService {
  private readonly logger = new Logger(WfInstancesClientService.name)

  constructor(
    @Inject(process.env.STATE_CLIENT || 'STATE_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  async create(createWfInstanceDto: CreateWfInstanceDto) {
    const observable = this.clientProxy.send('[PATTERN]WfInstancesController.create', createWfInstanceDto)
    const { data } = await firstValueFrom<{ data: WfInstance }>(observable)
    return data
  }

  async updateState(payload: { id: number; status: Status }) {
    const observable = this.clientProxy.send('[PATTERN]WfInstancesController.updateState', payload)
    const { data } = await firstValueFrom<{ data: WfInstance }>(observable)
    return data
  }

  async updateCurrentState(payload: { id: number; taskId: string; type: CurrentStatusType }) {
    try {
      const observable = this.clientProxy.send('[PATTERN]WfInstancesController.updateCurrentState', payload)
      const { data } = await firstValueFrom<{ data: WfInstance }>(observable)
      return data
    } catch (error) {
      const errorMessage = `updateCurrentState: ${JSON.stringify({ error }, null, 2)}`
      this.logger.error(errorMessage)

      throw new Error(errorMessage) // ! TODO: Improve it
    }
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
