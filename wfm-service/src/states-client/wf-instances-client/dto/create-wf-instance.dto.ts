import { IsArray, IsEnum, IsString } from 'class-validator'
import { Status } from 'src/states-client/enums/status.enum'

export class CreateWfInstanceDto {
  @IsString()
  definitionId: string

  @IsArray()
  @IsString({ each: true })
  currentStates: string[]

  @IsEnum(Status)
  status: Status
}
