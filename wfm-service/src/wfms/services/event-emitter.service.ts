import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class EventEmitterService {
  private readonly logger = new Logger(EventEmitterService.name)

  constructor(
    @InjectQueue(process.env.TASK_QUEUE || 'TASK_QUEUE')
    private taskQueue: Queue,
  ) {}

  async emitEvent(eventType: string, payload: any) {
    this.logger.log(`emitEvent: ${JSON.stringify({ eventType, payload }, null, 2)}`)

    await this.taskQueue.add(eventType, payload, { removeOnComplete: true })
  }
}
