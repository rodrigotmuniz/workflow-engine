import { PartialType } from '@nestjs/mapped-types'
import { CreateTaskExecutionDto } from './create-task-execution.dto'

export class UpdateTaskExecutionDto extends PartialType(CreateTaskExecutionDto) {}
