import { IsArray, IsEnum, IsJSON, IsNumber, IsOptional, IsString } from 'class-validator'
import { Status } from '../enums/status.enum'
import { Expose, Transform } from 'class-transformer'
import { Query, ParseArrayPipe } from '@nestjs/common'

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
  taskRetryInterval?: number

  @IsNumber()
  @IsOptional()
  taskTimeout?: number

  @IsArray()
  @IsString({ each: true })
  onFailure: string[]

  @IsArray()
  @IsString({ each: true })
  onSuccess: string[]

  @IsJSON()
  @IsOptional()
  input?: object

  @IsJSON()
  @IsOptional()
  output?: object
}
