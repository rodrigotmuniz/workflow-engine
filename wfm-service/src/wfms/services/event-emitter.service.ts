import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class EventEmitterService {
  private readonly logger = new Logger(EventEmitterService.name)

  constructor(
    @InjectQueue(process.env.TASK_QUEUE || 'TASK_QUEUE')
    private taskQueue: Queue,

    // @InjectQueue(process.env.TASK_QUEUE || 'TASK_QUEUE')
    // private taskQueue: Queue,
  ) {}

  async emitEvent(eventType: string, payload: any) {
    console.log(`🔹 Emitting dynamic event: ${eventType}`, payload)
    await this.taskQueue.add(eventType, payload, { removeOnComplete: true })
  }

  // async find() {
  //   this.logger.log('findAll()')
  //   console.log('Server A: Adding job to queue')
  //   await this.taskQueue.add('process_task', { message: 'Task from Server WFM' })
  //   return {}
  // }
}
