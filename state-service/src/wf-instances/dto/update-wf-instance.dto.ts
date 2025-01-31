import { PartialType } from '@nestjs/mapped-types'
import { CreateWfInstanceDto } from './create-wf-instance.dto'

export class UpdateWfInstanceDto extends PartialType(CreateWfInstanceDto) {
  id: number
}
