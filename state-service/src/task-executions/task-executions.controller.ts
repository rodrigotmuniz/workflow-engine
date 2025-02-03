import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateTaskExecutionDto } from './dto/create-task-execution.dto'
import { TaskExecutionsService } from './task-executions.service'
import { Status } from './enums/status.enum'
import { UpdateTaskExecutionDto } from './dto/update-task-execution.dto'
import { TaskExecutionPattern } from '@rodrigotmuniz/celito-workflow-engine'

@Controller()
export class TaskExecutionsController {
  private readonly logger = new Logger(TaskExecutionsController.name)

  constructor(private readonly taskExecutionsService: TaskExecutionsService) {}

  @MessagePattern(TaskExecutionPattern.CREATE)
  create(@Payload() createTaskExecutionDto: CreateTaskExecutionDto) {
    this.logger.log('create()')
    return this.taskExecutionsService.create(createTaskExecutionDto)
  }

  @MessagePattern(TaskExecutionPattern.CREATE_MANY)
  createMany(@Payload() createTaskExecutionDtos: CreateTaskExecutionDto[]) {
    this.logger.log('createMany()')
    return this.taskExecutionsService.createMany(createTaskExecutionDtos)
  }

  @MessagePattern(TaskExecutionPattern.FIND_BY_ID)
  findById(@Payload() id: number) {
    this.logger.log('findById()')
    return this.taskExecutionsService.findById(id)
  }

  @MessagePattern(TaskExecutionPattern.REMOVE_DEPENDENCY)
  removeDependency(@Payload() payload: { id: number; taskId: string }) {
    this.logger.log(`removeDependency: ${JSON.stringify(payload, null, 2)}`)

    const { id, taskId } = payload
    return this.taskExecutionsService.removeDependency(id, taskId)
  }

  @MessagePattern(TaskExecutionPattern.FIND_BY_TASK_AND_WD_INSTANCE)
  findOneByTaskIdAndWfInstanceId(@Payload() payload: { taskId: string; wfInstanceId: number }) {
    this.logger.log(`findOneByTaskIdAndWfInstanceId: ${JSON.stringify(payload, null, 2)}`)

    const { wfInstanceId, taskId } = payload
    return this.taskExecutionsService.findOneByTaskIdAndWfInstanceId(taskId, wfInstanceId)
  }

  @MessagePattern(TaskExecutionPattern.REMOVE_DEPENDENCIES_BY_ID)
  removeDependencyByIds(@Payload() payload: { taskIds: string[]; wfInstanceId: number; dependencyId: string }) {
    this.logger.log(`removeDependencyByIds: ${JSON.stringify(payload, null, 2)}`)

    const { taskIds, wfInstanceId, dependencyId } = payload
    return this.taskExecutionsService.removeDependencyByIds(taskIds, wfInstanceId, dependencyId)
  }

  @MessagePattern(TaskExecutionPattern.UPDATE_STATUS)
  updateStatus(@Payload() payload: { id: number, status: Status }) {
    this.logger.log(`updateStatus: ${JSON.stringify(payload, null, 2)}`)

    const { id, status } = payload
    return this.taskExecutionsService.updateStatus(id, status)
  }

  @MessagePattern(TaskExecutionPattern.UPDATE)
  update(@Payload() payload: { id: number, dto: UpdateTaskExecutionDto }) {
    this.logger.log(`update: ${JSON.stringify(payload, null, 2)}`)

    const { id, dto } = payload
    return this.taskExecutionsService.update(id, dto)
  }
}
