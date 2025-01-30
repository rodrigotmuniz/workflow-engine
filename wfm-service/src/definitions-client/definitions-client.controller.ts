import { Controller, Get, Inject, Logger } from '@nestjs/common'
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices'
import { CreateDefinitionDto } from './dto/create-definition.dto'
import { UpdateDefinitionDto } from './dto/update-definition.dto'

@Controller('definitions')
export class DefinitionsClientController {
  private readonly logger = new Logger(DefinitionsClientController.name)

  constructor(
    @Inject(process.env.DEFINITION_CLIENT || 'DEFINITION_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  @Get()
  findAll() {
    this.logger.log('findAll()')
    return this.clientProxy.send('bla bla bla', {})
  }

  // @MessagePattern('createDefinition')
  // create(@Payload() createDefinitionDto: CreateDefinitionDto) {
  //   return this.definitionsService.create(createDefinitionDto)
  // }

  // @MessagePattern('findAllDefinitions')
  // findAll() {
  //   return this.definitionsService.findAll()
  // }

  // @MessagePattern('findOneDefinition')
  // findOne(@Payload() id: number) {
  //   return this.definitionsService.findOne(id)
  // }

  // @MessagePattern('updateDefinition')
  // update(@Payload() updateDefinitionDto: UpdateDefinitionDto) {
  //   return this.definitionsService.update(updateDefinitionDto.id, updateDefinitionDto)
  // }

  // @MessagePattern('removeDefinition')
  // remove(@Payload() id: number) {
  //   return this.definitionsService.remove(id)
  // }
}
