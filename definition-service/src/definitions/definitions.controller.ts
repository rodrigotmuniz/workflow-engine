import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { DefinitionsPattern } from '@rodrigotmuniz/patterns'
import { DefinitionsService } from './definitions.service'
import { CreateDefinitionDto } from './dto/create-definition.dto'

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

  @MessagePattern('findJsonDefinitionByName')
  findJsonDefinitionByName(@Payload() name: string) {
    this.logger.log('findJsonDefinitionByName()')
    return this.definitionsService.findJsonDefinitionByName(name)
  }

  // @MessagePattern(DefinitionsPattern.REMOVE)
  // remove(@Payload() id: number) {
  //   this.logger.log('remove()')
  //   return this.definitionsService.remove(id)
  // }
}
