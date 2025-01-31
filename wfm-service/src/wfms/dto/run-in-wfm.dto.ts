import { IsString } from 'class-validator'

export class RunInWfmDto {
  @IsString()
  name: string
}
