import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class DlqsClientService {
  private readonly logger = new Logger(DlqsClientService.name)

  constructor(
    @InjectQueue(process.env.DLQ_QUEUE || 'DLQ_QUEUE')
    private dlqQueue: Queue,
  ) {}

  emitEvent(eventType: string, payload: any) {
    try {
      this.logger.log(`emitEvents: ${JSON.stringify({ eventType, payload }, null, 2)}`)

      return this.dlqQueue.add(eventType, payload, {
        removeOnComplete: true,
        attempts: Number(process.env.QUEUE_ATTEMPS || 3),
        backoff: Number(process.env.QUEUE_BACKOFF || 5000),
      })
    } catch (error) {
      this.logger.error(`emitEvents: ${JSON.stringify({ message: error.message }, null, 2)}`)
      throw error
    }
  }
}
