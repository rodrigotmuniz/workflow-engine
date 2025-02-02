import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateTaskExecutionDto } from './dto/create-task-execution.dto'
import { TaskExecutionsService } from './task-executions.service'
import { Status } from './enums/status.enum'
import { UpdateTaskExecutionDto } from './dto/update-task-execution.dto'

@Controller()
export class TaskExecutionsController {
  private readonly logger = new Logger(TaskExecutionsController.name)

  constructor(private readonly taskExecutionsService: TaskExecutionsService) {}

  @MessagePattern('[PATTERN]TaskExecutionsController.create')
  create(@Payload() createTaskExecutionDto: CreateTaskExecutionDto) {
    this.logger.log('create()')
    return this.taskExecutionsService.create(createTaskExecutionDto)
  }

  @MessagePattern('[PATTERN]TaskExecutionsController.createMany')
  createMany(@Payload() createTaskExecutionDtos: CreateTaskExecutionDto[]) {
    this.logger.log('createMany()')
    return this.taskExecutionsService.createMany(createTaskExecutionDtos)
  }

  @MessagePattern('[PATTERN]TaskExecutionsController.findById')
  findById(@Payload() id: number) {
    this.logger.log('findById()')
    return this.taskExecutionsService.findById(id)
  }

  @MessagePattern('[PATTERN]TaskExecutionsController.removeDependency')
  removeDependency(@Payload() payload: { id: number; taskId: string }) {
    this.logger.log(`removeDependency: ${JSON.stringify(payload, null, 2)}`)

    const { id, taskId } = payload
    return this.taskExecutionsService.removeDependency(id, taskId)
  }

  @MessagePattern('[PATTERN]TaskExecutionsController.findOneByTaskIdAndWfInstanceId')
  findOneByTaskIdAndWfInstanceId(@Payload() payload: { taskId: string; wfInstanceId: number }) {
    this.logger.log(`findOneByTaskIdAndWfInstanceId: ${JSON.stringify(payload, null, 2)}`)

    const { wfInstanceId, taskId } = payload
    return this.taskExecutionsService.findOneByTaskIdAndWfInstanceId(taskId, wfInstanceId)
  }

  @MessagePattern('[PATTERN]TaskExecutionsController.removeDependencyByIds')
  removeDependencyByIds(@Payload() payload: { taskIds: string[]; wfInstanceId: number; dependencyId: string }) {
    this.logger.log(`removeDependencyByIds: ${JSON.stringify(payload, null, 2)}`)

    const { taskIds, wfInstanceId, dependencyId } = payload
    return this.taskExecutionsService.removeDependencyByIds(taskIds, wfInstanceId, dependencyId)
  }

  @MessagePattern('[PATTERN]TaskExecutionsController.updateStatus')
  updateStatus(@Payload() payload: { id: number, status: Status }) {
    this.logger.log(`updateStatus: ${JSON.stringify(payload, null, 2)}`)

    const { id, status } = payload
    return this.taskExecutionsService.updateStatus(id, status)
  }

  @MessagePattern('[PATTERN]TaskExecutionsController.update')
  update(@Payload() payload: { id: number, dto: UpdateTaskExecutionDto }) {
    this.logger.log(`update: ${JSON.stringify(payload, null, 2)}`)

    const { id, dto } = payload
    return this.taskExecutionsService.update(id, dto)
  }

  // @MessagePattern('[PATTERN]TaskExecutionsController.updateStatus')
  // updateStatus(@Payload() payload: { taskId: string; wfInstanceId: number; status: Status }) {
  //   this.logger.log(`updateStatus: ${JSON.stringify(payload, null, 2)}`)

  //   const { taskId, wfInstanceId, status } = payload
  //   return this.taskExecutionsService.updateStatus(taskId, wfInstanceId, status)
  // }
}
