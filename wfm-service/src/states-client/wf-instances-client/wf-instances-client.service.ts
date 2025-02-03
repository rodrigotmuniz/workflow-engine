import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { WorkflowDefinitionDto } from 'src/definitions-client/dto/wf-definition.dto'
import { Status } from '../../commons/enums/status.enum'
import { CreateWfInstanceDto } from './dto/create-wf-instance.dto'
import { WfInstance } from './entities/wf-instance.entity'
import { CurrentStatusType } from '../../commons/enums/currentStatusType.enum'
import { WfInstancePattern } from '@rodrigotmuniz/celito-workflow-engine'

@Injectable()
export class WfInstancesClientService {
  private readonly logger = new Logger(WfInstancesClientService.name)

  constructor(
    @Inject(process.env.STATE_CLIENT || 'STATE_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  async create(createWfInstanceDto: CreateWfInstanceDto) {
    try {
      this.logger.log(`create: ${JSON.stringify({ createWfInstanceDto }, null, 2)}`)

      const observable = this.clientProxy.send(WfInstancePattern.CREATE, createWfInstanceDto)
      const { data } = await firstValueFrom<{ data: WfInstance }>(observable)
      return data
    } catch (error) {
      this.logger.error(`create: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async updateState(payload: { id: number; status: Status }) {
    try {
      this.logger.log(`updateState: ${JSON.stringify({ payload }, null, 2)}`)

      const observable = this.clientProxy.send(WfInstancePattern.UPDATE_STATE, payload)
      const { data } = await firstValueFrom<{ data: WfInstance }>(observable)
      return data
    } catch (error) {
      this.logger.error(`updateState: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async updateCurrentState(payload: { id: number; taskId: string; type: CurrentStatusType }) {
    try {
      this.logger.log(`updateCurrentState: ${JSON.stringify({ payload }, null, 2)}`)

      const observable = this.clientProxy.send(WfInstancePattern.UPDATE_CURRENT_STATE, payload)
      const { data } = await firstValueFrom<{ data: WfInstance }>(observable)
      return data
    } catch (error) {
      this.logger.error(`updateCurrentState: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async createByDefinition(definition: WorkflowDefinitionDto) {
    try {
      this.logger.log(`createByDefinition: ${JSON.stringify({ definition }, null, 2)}`)

      const currentState = definition.tasks[0].id
      const wfInstance = await this.create({
        currentStates: [currentState],
        definitionId: definition.id,
        status: Status.PENDING,
      })
      return wfInstance
    } catch (error) {
      this.logger.error(`createByDefinition: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }
}
