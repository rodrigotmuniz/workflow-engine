import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { DefinitionsService } from './definitions.service'
import { CreateDefinitionDto } from './dto/create-definition.dto'
import { UpdateDefinitionDto } from './dto/update-definition.dto'

@Controller()
export class DefinitionsController {
  private readonly logger = new Logger(DefinitionsController.name)

  constructor(private readonly definitionsService: DefinitionsService) {}

  @MessagePattern('createDefinition')
  create(@Payload() createDefinitionDto: CreateDefinitionDto) {
    return this.definitionsService.create(createDefinitionDto)
  }

  @MessagePattern('DefinitionsController')
  findAll() {
    this.logger.log('findAll()')

    return this.definitionsService.findAll()
  }

  @MessagePattern('findOneDefinition')
  findOne(@Payload() id: number) {
    return this.definitionsService.findOne(id)
  }

  @MessagePattern('updateDefinition')
  update(@Payload() updateDefinitionDto: UpdateDefinitionDto) {
    return this.definitionsService.update(updateDefinitionDto.id, updateDefinitionDto)
  }

  @MessagePattern('removeDefinition')
  remove(@Payload() id: number) {
    return this.definitionsService.remove(id)
  }
}
