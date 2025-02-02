import { Process, Processor } from '@nestjs/bull'
import { InternalServerErrorException, Logger, ServiceUnavailableException } from '@nestjs/common'
import { Job } from 'bull'
import { DlqsClientService } from 'src/dlq-client/dlq-client.service'
import { LogsClientService } from 'src/logs-client/logs-client.service'
import { WfmsClientService } from 'src/wfm-client/wfm-client.service'

let counter = 1
@Processor(process.env.TASK_QUEUE || 'TASK_QUEUE')
export class TaskQueuesProcessor {
  private readonly logger = new Logger(TaskQueuesProcessor.name)

  constructor(
    private readonly wfmsClientService: WfmsClientService,
    private readonly dlqsClientService: DlqsClientService,
    private readonly logsClientService: LogsClientService,
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
      const errorMessage = `handleTask: 
        ${JSON.stringify({ name, data, attemptsMade, attempts: opts.attempts, message: error.message }, null, 2)} | [PID ${process.pid}]`

      this.logger.error(errorMessage)

      if (job.attemptsMade + 1 === Number(job.opts.attempts || 1)) {
        this.dlqsClientService.emitEvent(job.name, { ...job.data, success: false })
        this.logsClientService.emitEvent(job.name, { ...job.data, success: false })
        this.wfmsClientService.emitEvent(job.name, { data: { ...job.data, message: 'Error' }, success: false })
        throw new ServiceUnavailableException(errorMessage)
      }
      throw new InternalServerErrorException(error.message || error)
    }
  }
}
