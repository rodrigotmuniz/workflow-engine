import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskQueueDto } from './create-task-queue.dto';

export class UpdateTaskQueueDto extends PartialType(CreateTaskQueueDto) {
  id: number;
}
