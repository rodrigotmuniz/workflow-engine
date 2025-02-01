import { IsArray, IsEnum, IsString } from 'class-validator'
import { Status } from '../enums/status.enum'
import { Transform } from 'class-transformer'

export class CreateWfInstanceDto {
  @IsString()
  definitionId: string

  @IsArray()
  @IsString({ each: true })
  currentStates: string[]

  @IsEnum(Status)
  status: Status
}
