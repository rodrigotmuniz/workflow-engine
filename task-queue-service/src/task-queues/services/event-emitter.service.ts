import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class EventEmitterService {
  private readonly logger = new Logger(EventEmitterService.name)

  constructor(
    @InjectQueue(process.env.WFM_QUEUE || 'WFM_QUEUE')
    private wfmQueue: Queue,
  ) {}

  async emitWfmQueueEvent(eventType: string, payload: any) {
    this.logger.log(`emitWfmQueueEvent: ${JSON.stringify({ eventType, payload }, null, 2)}`)

    await this.wfmQueue.add(eventType, payload, { removeOnComplete: true })
  }
}
