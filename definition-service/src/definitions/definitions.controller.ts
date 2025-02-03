import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { DefinitionsService } from './definitions.service'
import { CreateDefinitionDto } from './dto/create-definition.dto'
import { DefinitionsPattern } from '@rodrigotmuniz/celito-workflow-engine'

@Controller()
export class DefinitionsController {
  private readonly logger = new Logger(DefinitionsController.name)

  constructor(private readonly definitionsService: DefinitionsService) {}

  @MessagePattern(DefinitionsPattern.CREATE)
  create(@Payload() createDefinitionDto: CreateDefinitionDto) {
    this.logger.log('create()')
    return this.definitionsService.create(createDefinitionDto)
  }

  @MessagePattern(DefinitionsPattern.FIND_ALL)
  findAll() {
    this.logger.log('findAll()')
    return this.definitionsService.findAll()
  }

  @MessagePattern(DefinitionsPattern.FIND_BY_NAME)
  findByName(@Payload() name: string) {
    this.logger.log('findByName()')
    return this.definitionsService.findByName(name)
  }

  @MessagePattern(DefinitionsPattern.FIND_JSON)
  findJsonDefinitionByName(@Payload() name: string) {
    this.logger.log(`findJsonDefinitionByName(): ${JSON.stringify(name, null, 2)}`)
    return this.definitionsService.findJsonDefinitionByName(name)
  }
}
