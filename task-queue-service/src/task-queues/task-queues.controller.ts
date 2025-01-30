import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskQueuesService } from './task-queues.service';
import { CreateTaskQueueDto } from './dto/create-task-queue.dto';
import { UpdateTaskQueueDto } from './dto/update-task-queue.dto';

@Controller()
export class TaskQueuesController {
  private readonly logger = new Logger(TaskQueuesController.name)

  constructor(private readonly taskQueuesService: TaskQueuesService) {}

  @MessagePattern('createTaskQueue')
  create(@Payload() createTaskQueueDto: CreateTaskQueueDto) {
    return this.taskQueuesService.create(createTaskQueueDto);
  }

  @MessagePattern('findAllTaskQueues')
  findAll() {
    this.logger.log('findAll()')
    return this.taskQueuesService.findAll();
  }

  @MessagePattern('findOneTaskQueue')
  findOne(@Payload() id: number) {
    return this.taskQueuesService.findOne(id);
  }

  @MessagePattern('updateTaskQueue')
  update(@Payload() updateTaskQueueDto: UpdateTaskQueueDto) {
    return this.taskQueuesService.update(updateTaskQueueDto.id, updateTaskQueueDto);
  }

  @MessagePattern('removeTaskQueue')
  remove(@Payload() id: number) {
    return this.taskQueuesService.remove(id);
  }
}
