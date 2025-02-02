import { Process, Processor } from '@nestjs/bull'
import { InternalServerErrorException, Logger, ServiceUnavailableException } from '@nestjs/common'
import { Job } from 'bull'
import { WfmsService } from '../services/wfms.service'
import { DlqsClientService } from 'src/dlq-client/dlqclient.service'

@Processor(process.env.WFM_QUEUE || 'WFM_QUEUE')
export class WfmsProcessor {
  private readonly logger = new Logger(WfmsProcessor.name)

  constructor(
    private readonly wfmsService: WfmsService,
    private readonly dlqsClientService: DlqsClientService,
  ) {}

  @Process('*')
  async handleTask(job: Job) {
    try {
      this.logger.log(`handleTask: ${JSON.stringify({ name: job.name, data: job.data }, null, 2)} | [PID ${process.pid}]`)

      const jobData = job.data
      const { onSuccess, onFailure, taskId, wfInstanceId } = jobData.data
      this.logger.debug(`Init: ${JSON.stringify({ data: jobData.data }, null, 2)}`)

      const nextTasks = jobData.success ? onSuccess : onFailure

      await this.wfmsService.completeTask(jobData.data, jobData.success)
      await this.wfmsService.initTasks(nextTasks, taskId, wfInstanceId, jobData.data.output)
    } catch (error) {
      const { name, data, attemptsMade, opts } = job
      const errorMessage = `handleTask: 
        ${JSON.stringify({ name, data, attemptsMade, attempts: opts.attempts, message: error.message }, null, 2)} | [PID ${process.pid}]`

      this.logger.error(errorMessage)

      if (job.attemptsMade < Number(job.opts.attempts || 1)) {
        this.dlqsClientService.emitEvent(job.name, { ...job.data, success: false })
        throw new ServiceUnavailableException(errorMessage)
      }
      throw new InternalServerErrorException(error.message || error)
    }
  }
}
