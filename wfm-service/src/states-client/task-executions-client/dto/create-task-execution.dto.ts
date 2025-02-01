import { IsArray, IsEnum, IsJSON, IsNumber, IsOptional, IsString } from 'class-validator'
import { Status } from 'src/states-client/enums/status.enum'

export class CreateTaskExecutionDto {
  @IsString()
  definitionId: string // ! Verify if it is necessary

  @IsString()
  wfInstanceId: number

  @IsEnum(Status)
  status: Status

  @IsArray()
  @IsString({ each: true })
  dependencies: string[]

  @IsString()
  taskId: string

  @IsString()
  taskType: string

  @IsString()
  taskService: string

  @IsString()
  taskAction: string

  @IsNumber()
  @IsOptional()
  taskRetry?: number

  @IsNumber()
  @IsOptional()
  taskTimeout?: number

  @IsArray()
  @IsString({ each: true })
  // @IsOptional()
  onFailure: string[]

  @IsArray()
  @IsString({ each: true })
  // @IsOptional()
  onSuccess: string[]

  @IsJSON()
  @IsOptional()
  input?: object

  @IsJSON()
  @IsOptional()
  output?: object
}
