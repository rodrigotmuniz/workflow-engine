import { PartialType } from '@nestjs/mapped-types'
import { CreateAuthDto } from './create-definition.dto'

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  id: number
}
