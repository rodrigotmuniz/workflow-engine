import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateWfInstanceDto } from './dto/create-wf-instance.dto'
import { WfInstance } from './entities/wf-instance.entity'

@Injectable()
export class WfInstancesService {
  private readonly logger = new Logger(WfInstancesService.name)

  constructor(
    @InjectRepository(WfInstance)
    private readonly repository: Repository<WfInstance>,
  ) {}

  async create(createWfInstanceDto: CreateWfInstanceDto) {
    this.logger.log('Creating new wfInstance...')

    const newWfInstance = this.repository.create(createWfInstanceDto)
    const saveWfInstance = await this.repository.save(newWfInstance)

    this.logger.log(`wfInstance created with ID: ${saveWfInstance.id}`)
    return saveWfInstance
  }
}
