import { Injectable } from '@nestjs/common'
import { CreateWfmDto } from './dto/create-wfm.dto'
import { UpdateWfmDto } from './dto/update-wfm.dto'
import { TaskQueuesService } from './services/task-queues.service'

@Injectable()
export class WfmsService {
  constructor(private readonly taskQueuesService: TaskQueuesService) {}

  create(createWfmDto: CreateWfmDto) {
    return 'This action adds a new wfm'
  }

  async findAll() {
    return await this.taskQueuesService.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} wfm`
  }

  update(id: number, updateWfmDto: UpdateWfmDto) {
    return `This action updates a #${id} wfm`
  }

  remove(id: number) {
    return `This action removes a #${id} wfm`
  }
}
