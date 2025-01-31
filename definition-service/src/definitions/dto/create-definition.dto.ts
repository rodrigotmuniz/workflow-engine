import { IsJSON, IsString } from 'class-validator'
import { Unique } from 'typeorm'

export class CreateDefinitionDto {
  @IsString()
  name: string

  @IsJSON()
  definition: object
}
