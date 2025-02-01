import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateWfInstanceDto } from '../dto/create-wf-instance.dto'
import { WfInstance } from '../entities/wf-instance.entity'
import { Status } from '../enums/status.enum'
import { CurrentStatusType } from '../enums/currentStatusType.enum'

@Injectable()
export class WfInstancesService {
  private readonly logger = new Logger(WfInstancesService.name)

  constructor(
    @InjectRepository(WfInstance)
    private readonly repository: Repository<WfInstance>,
  ) {}

  async create(createWfInstanceDto: CreateWfInstanceDto) {
    this.logger.log(`create: ${JSON.stringify({ createWfInstanceDto }, null, 2)}`)

    this.logger.log('Creating new wfInstance...')

    const newWfInstance = this.repository.create(createWfInstanceDto)
    const saveWfInstance = await this.repository.save(newWfInstance)

    this.logger.log(`wfInstance created with ID: ${saveWfInstance.id}`)
    return saveWfInstance
  }

  async updateState(id: number, status: Status) {
    this.logger.log(`updateState: ${JSON.stringify({ id, status }, null, 2)}`)

    const updatedStatus = await this.repository.update({ id }, { status })
    return updatedStatus
  }

  async updateCurrentState(id: number, taskId: string, type: CurrentStatusType) {
    try {
      this.logger.log(`updateCurrentState: ${JSON.stringify({ id, taskId, type }, null, 2)}`)
  
      const currentStates = () => {
        const arrayType = type.toLocaleLowerCase()
        return `array_${arrayType}(currentStates, '${taskId}')`
      }
  
      const result = await this.repository
        .createQueryBuilder()
        .update(WfInstance)
        .set({ currentStates })
        .where('id = :id', { id })
        // .returning('*')
        .execute()
    }catch(error) {
      const errorMessage = `updateCurrentState: ${JSON.stringify({ error }, null, 2)}`
      this.logger.error(errorMessage)

      throw new Error(errorMessage) // ! TODO: Improve it
    }


    // const updatedStatus = await this.repository.update({ id }, { status })
    // return updatedStatus
  }
}
