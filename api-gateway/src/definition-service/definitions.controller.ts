import { Body, Controller, Delete, Get, Inject, Logger, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { DefinitionsPattern } from '@rodrigotmuniz/celito-workflow-engine'
import { Roles } from 'src/commons/auth/decorators/roles.decorator'
import { ROLES } from 'src/commons/auth/enums/roles.enum'
import { JwtAuthGuard } from 'src/commons/auth/guards/jwt.guard'

@Controller('definitions')
export class DefinitionsController {
  private readonly logger = new Logger(DefinitionsController.name)

  constructor(
    @Inject(process.env.DEFINITION_CLIENT || 'DEFINITION_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  @Post()
  @Roles([ROLES.ADMIN, ROLES.USER])
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: any) {
    this.logger.log('create()')
    return this.clientProxy.send(DefinitionsPattern.CREATE, dto)
  }

  @Get()
  findAll() {
    this.logger.log('findAll()')
    return this.clientProxy.send(DefinitionsPattern.FIND_ALL, {})
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    this.logger.log('findByName()')
    return this.clientProxy.send(DefinitionsPattern.FIND_BY_NAME, name)
  }

  @Get(':name/json')
  findJsonDefinitionByName(@Param('name') name: string) {
    this.logger.log('findJsonDefinitionByName()')
    return this.clientProxy.send(DefinitionsPattern.FIND_JSON, name)
  }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   this.logger.log('remove()')
  //   return this.clientProxy.send(DefinitionsPattern.REMOVE, id)
  // }
}
