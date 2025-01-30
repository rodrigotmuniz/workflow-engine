import { PartialType } from '@nestjs/mapped-types'
import { CreateDefinitionDto } from './create-definition.dto'

export class UpdateDefinitionDto extends PartialType(CreateDefinitionDto) {
  id: number
}
