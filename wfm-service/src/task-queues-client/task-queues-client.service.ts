import { InjectQueue } from '@nestjs/bull'
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class TaskQueuesClientService {
  private readonly logger = new Logger(TaskQueuesClientService.name)

  constructor(
    @InjectQueue(process.env.TASK_QUEUE || 'TASK_QUEUE')
    private taskQueue: Queue,
  ) {}

  emitEvent(eventType: string, payload: any) {
    try {
      this.logger.log(`emitEvent: ${JSON.stringify({ eventType, payload }, null, 2)}`)

      return this.taskQueue.add(eventType, payload, {
        removeOnComplete: true,
        attempts: payload.taskRetry,
        backoff: payload.taskRetryInterval,
        timeout: payload.taskTimeout,
      })
    } catch (error) {
      this.logger.error(`emitEvent: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }

  async emitEvents(initialExecutions) {
    try {
      this.logger.log(`emitEvents: ${JSON.stringify({ initialExecutions }, null, 2)}`)

      const tasksPromises = initialExecutions.map((execution) => this.emitEvent(execution.taskId, execution))
      await Promise.all(tasksPromises)
    } catch (error) {
      this.logger.error(`emitEvents: ${JSON.stringify({ message: error.message }, null, 2)}`)

      throw new InternalServerErrorException(error.message || error)
    }
  }
}
