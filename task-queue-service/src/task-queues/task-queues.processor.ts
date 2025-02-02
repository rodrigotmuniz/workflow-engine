import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { DlqsClientService } from 'src/dlq-client/dlqclient.service'
import { WfmsClientService } from 'src/wfm-client/wfm-client.service'

let counter = 1
@Processor(process.env.TASK_QUEUE || 'TASK_QUEUE')
export class TaskQueuesProcessor {
  private readonly logger = new Logger(TaskQueuesProcessor.name)

  constructor(
    private readonly wfmsClientService: WfmsClientService,
    private readonly dlqsClientService: DlqsClientService,
  ) {}

  @Process('*')
  async handleTask(job: Job) {
    this.logger.log(`handleTask: ${JSON.stringify({ name: job.name, data: job.data }, null, 2)} | [PID ${process.pid}]`)

    try {
      throw new Error(job.name)
      let success = true
      const output = { message: counter++ }

      this.wfmsClientService.emitEvent(job.name, { data: { ...job.data, output }, success })
    } catch (error) {
      const { name, data, attemptsMade, opts } = job
      this.logger.error(`handleTask: ${JSON.stringify({ name, data, attemptsMade, attempts: opts.attempts }, null, 2)} | [PID ${process.pid}]`)

      if (job.attemptsMade < Number(job.opts.attempts || 1)) {
        this.dlqsClientService.emitEvent(job.name, { ...job.data, success: false })
        this.wfmsClientService.emitEvent(job.name, { data: { ...job.data, message: 'Error' }, success: false })
      }
      throw error
    }
  }
}
