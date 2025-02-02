import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class WfmsClientService {
  private readonly logger = new Logger(WfmsClientService.name)

  constructor(
    @InjectQueue(process.env.WFM_QUEUE || 'WFM_QUEUE')
    private wfmQueue: Queue,
  ) {}

  emitEvent(eventType: string, payload: any) {
    this.logger.log(`emitEvent: ${JSON.stringify({ eventType, payload }, null, 2)}`)

    return this.wfmQueue.add(eventType, payload, { removeOnComplete: true, attempts: 4, backoff: 500 })
  }

  async emitEvents(initialExecutions) {
    this.logger.log(`emitEvents: ${JSON.stringify({ initialExecutions }, null, 2)}`)

    const tasksPromises = initialExecutions.map((execution) => this.emitEvent(execution.taskId, execution))
    await Promise.all(tasksPromises)
  }
}
