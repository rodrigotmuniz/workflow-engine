import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
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
    try {
      this.logger.log(`create: ${JSON.stringify({ createDefinitionDto }, null, 2)}`)

      const newDefinition = this.repository.create(createDefinitionDto)
      const saveDefinition = await this.repository.save(newDefinition)

      return saveDefinition
    } catch (error) {
      this.logger.error(`create: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async findAll() {
    try {
      this.logger.log(`findAll: ${JSON.stringify({}, null, 2)}`)

      const foundDefinition = await this.repository.find()
      return foundDefinition
    } catch (error) {
      this.logger.error(`findAll: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async findByName(name: string, select?: FindOptionsSelect<Definition>) {
    try {
      this.logger.log(`findByName: ${JSON.stringify({ name, select }, null, 2)}`)

      const foundDefinition = await this.repository.findOne({ where: { name }, select })
      return foundDefinition
    } catch (error) {
      this.logger.error(`findByName: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async findByNameOrFail(name: string, select?: FindOptionsSelect<Definition>) {
    try {
      this.logger.log(`findByNameOrFail: ${JSON.stringify({ name, select }, null, 2)}`)

      const foundDefinition = await this.repository.findOne({ where: { name }, select })

      if (!foundDefinition) {
        const errorMessage = `Definition not found. No defnition exists with the provided name: ${name}.`
        this.logger.error(errorMessage)
        throw new NotFoundException(errorMessage)
      }

      return foundDefinition
    } catch (error) {
      this.logger.error(`findByNameOrFail: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async findJsonDefinitionByName(name: string) {
    try {
      this.logger.log(`findJsonDefinitionByName: ${JSON.stringify({ name }, null, 2)}`)

      const { definition } = (await this.findByNameOrFail(name, { definition: {} })) as any
      const json = JSON.parse(definition)
      return json
    } catch (error) {
      this.logger.error(`findJsonDefinitionByName: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }
}
