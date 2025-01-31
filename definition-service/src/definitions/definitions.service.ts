import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, FindOptionsSelect, Repository } from 'typeorm'
import { CreateDefinitionDto } from './dto/create-definition.dto'
import { Definition } from './entities/definition.entity'

@Injectable()
export class DefinitionsService {
  private readonly logger = new Logger(DefinitionsService.name)

  constructor(
    @InjectRepository(Definition)
    private readonly repository: Repository<Definition>,
  ) {}

  async create(createDefinitionDto: CreateDefinitionDto) {
    this.logger.log('Creating new definition...')

    const newDefinition = this.repository.create(createDefinitionDto)
    const saveDefinition = await this.repository.save(newDefinition)

    this.logger.log(`definition created with ID: ${saveDefinition.id}`)
    return saveDefinition
  }

  async findAll() {
    this.logger.log('Fetching all definitions...')

    const foundDefinition = await this.repository.find()

    this.logger.log(`Found ${foundDefinition.length} definitions`)
    return foundDefinition
  }

  async findByName(name: string, select?: FindOptionsSelect<Definition>) {
    this.logger.log(`Finding definition with name: ${name}...`)

    const foundDefinition = await this.repository.findOne({ where: { name }, select })

    this.logger.log(`Definition found: ${foundDefinition ? 'Yes' : 'No'}`)
    return foundDefinition
  }

  async findJsonDefinitionByName(name: string) {
    this.logger.log(`Finding json definition with name: ${name}...`)

    const { definition } = await this.findByName(name, { definition: {} }) as any// ! TODO: passar para orFail
    const json = JSON.parse(definition)
    return json
  }

  // async remove(id: number) {
  //   this.logger.log(`Removing definition with ID: ${id}...`)

  //   const [foundDefinition] = await Promise.all([this.findByIdOrFail(id), this.cropsService.definitionExistsOrFail(id)])

  //   const removedDefinition = await this.repository.remove([foundDefinition])
  //   this.logger.log(`Definition with ID: ${id} removed successfully`)
  //   return removedDefinition
  // }
}
