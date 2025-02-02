import { IsJSON, IsString } from 'class-validator'

export class CreateAuthDto {
  @IsString()
  name: string

  @IsJSON()
  auth: object
}
