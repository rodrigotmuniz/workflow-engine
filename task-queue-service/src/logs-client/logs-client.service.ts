import { InjectQueue } from '@nestjs/bull'
import { Injectable, InternalServerErrorException, Logger, ServiceUnavailableException } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class LogsClientService {
  private readonly logger = new Logger(LogsClientService.name)

  constructor(
    @InjectQueue(process.env.LOGS_QUEUE || 'LOGS_QUEUE')
    private logsQueue: Queue,
  ) {}

  emitEvent(eventType: string, payload: any) {
    try {
      this.logger.log(`emitEvent: ${JSON.stringify({ eventType, payload }, null, 2)}`)

      return this.logsQueue.add(eventType, payload, {
        removeOnComplete: true,
        attempts: Number(process.env.QUEUE_ATTEMPS || 3),
        backoff: Number(process.env.QUEUE_BACKOFF || 5000),
      })
    } catch (error) {
      this.logger.error(`emitEvent: ${JSON.stringify({ message: error.message }, null, 2)}`)

      if (error.message.includes('queue is not ready')) {
        throw new ServiceUnavailableException('Queue service is currently unavailable.')
      }
      throw new InternalServerErrorException(error.message || error)
    }
  }
}
