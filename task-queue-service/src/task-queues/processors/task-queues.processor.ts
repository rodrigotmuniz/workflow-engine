import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { WfmsClientService } from 'src/wfm-client/wfm-client.service'

let counter = 1
@Processor(process.env.TASK_QUEUE || 'TASK_QUEUE')
export class TaskQueuesProcessor {
  private readonly logger = new Logger(TaskQueuesProcessor.name)

  constructor(private readonly wfmsClientService: WfmsClientService) {}

  @Process('*')
  async handleTask(job: Job) {
    this.logger.log(`emitWfmQueueEvent: `)
    // this.logger.log(`emitWfmQueueEvent: ${JSON.stringify({ name: job.name, data: job.data }, null, 2)} | [PID ${process.pid}]`)

    try {
      if (['B', 'E'].includes(job.name)) {
        throw new Error('ERRRRORR')
      }
      // setTimeout(() => {
      let success = true
      const output = { message: counter++ }
      // if (job.name === 'B')  success = false
      this.wfmsClientService.emitEvent(job.name, { data: { ...job.data, output }, success })
      // }, 0)
    } catch (error) {
      this.logger.error(`emitWfmQueueEvent: ${job.attemptsMade} | ${job.opts.attempts}`)
      if (job.attemptsMade + 1 === job.opts.attempts) {
        this.logger.warn(`EMITA DLQ`)
        this.wfmsClientService.emitEvent(job.name, { data: { ...job.data, message: 'Error' }, success: false })
      }
      throw error
    }
  }
}
