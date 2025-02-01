import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Matches, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Define task types
export enum TaskType {
  SERVICE_CALL = 'service_call',
  DATABASE_QUERY = 'database_query',
  DATABASE_UPDATE = 'database_update',
  EXTERNAL_API = 'external_api',
  NOTIFICATION = 'notification'
}

// Task DTO
class TaskDto {
  @IsString()
  id: string;

  @IsEnum(TaskType)
  type: TaskType;

  @IsString()
  service: string;

  @IsString()
  action: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  retry?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  timeout?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  retryInterval?: number;

  @IsBoolean()
  @IsOptional()
  onFailure?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  input?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  output?: string[];
}

// Transition DTO
class TransitionDto {
  @IsArray()
  @IsString({ each: true })
  from: string[];

  @IsArray()
  @IsString({ each: true })
  to: string[]

  @IsBoolean()
  @IsOptional()
  onSuccess?: boolean;

  @IsBoolean()
  @IsOptional()
  onFailure?: boolean;
}

// Validation Rule DTO
class ValidationRuleDto {
  @IsString()
  field: string;

  @IsString()
  rule: string;
}

// Main Workflow DTO
export class WorkflowDefinitionDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @Matches(/^\d+\.\d+$/, { message: 'Version must be in format X.Y (e.g., 1.4)' })
  version: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransitionDto)
  transitions: TransitionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidationRuleDto)
  @IsOptional()
  validationRules?: ValidationRuleDto[];
}
