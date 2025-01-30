import { Injectable } from '@nestjs/common';
import { CreateTaskQueueDto } from './dto/create-task-queue.dto';
import { UpdateTaskQueueDto } from './dto/update-task-queue.dto';

@Injectable()
export class TaskQueuesService {
  create(createTaskQueueDto: CreateTaskQueueDto) {
    return 'This action adds a new taskQueue';
  }

  findAll() {
    return `This action returns all taskQueues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskQueue`;
  }

  update(id: number, updateTaskQueueDto: UpdateTaskQueueDto) {
    return `This action updates a #${id} taskQueue`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskQueue`;
  }
}
