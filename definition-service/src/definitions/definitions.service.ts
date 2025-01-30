import { Injectable } from '@nestjs/common'
import { CreateDefinitionDto } from './dto/create-definition.dto'
import { UpdateDefinitionDto } from './dto/update-definition.dto'

@Injectable()
export class DefinitionsService {
  constructor() {}

  create(createDefinitionDto: CreateDefinitionDto) {
    return 'This action adds a new definition'
  }

  async findAll() {
    return 'DefinitionsService findall'
  }

  findOne(id: number) {
    return `This action returns a #${id} definition`
  }

  update(id: number, updateDefinitionDto: UpdateDefinitionDto) {
    return `This action updates a #${id} definition`
  }

  remove(id: number) {
    return `This action removes a #${id} definition`
  }
}
