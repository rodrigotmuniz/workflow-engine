import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { EventEmitterService } from '../services/event-emitter.service'

@Processor(process.env.TASK_QUEUE || 'TASK_QUEUE')
export class TaskQueuesProcessor {
  private readonly logger = new Logger(TaskQueuesProcessor.name)

  constructor(private readonly eventEmitterService: EventEmitterService) {}

  @Process('*')
  async handleTask(job: Job) {
    this.logger.log(`emitWfmQueueEvent: ${JSON.stringify({ name: job.name, data: job.data }, null, 2)} | [PID ${process.pid}]`)

    setTimeout(() => {
      let success = true
      // if (job.name === 'B')  success = false
      this.eventEmitterService.emitWfmQueueEvent(job.name, { data: job.data, success })
    }, 0)
  }
}
