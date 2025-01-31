import { PartialType } from '@nestjs/mapped-types'
import { RunInWfmDto } from './run-in-wfm.dto'

export class UpdateWfmDto extends PartialType(RunInWfmDto) {
  id: number
}
