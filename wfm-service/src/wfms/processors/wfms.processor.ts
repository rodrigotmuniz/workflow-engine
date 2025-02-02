import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { WfmsService } from '../services/wfms.service'

@Processor(process.env.WFM_QUEUE || 'WFM_QUEUE')
export class WfmsProcessor {
  private readonly logger = new Logger(WfmsProcessor.name)

  constructor(private readonly wfmsService: WfmsService) {}
  @Process('*')
  async handleTask(job: Job) {
    this.logger.log(`emitWfmQueueEvent: ${JSON.stringify({ name: job.name, data: job.data }, null, 2)} | [PID ${process.pid}]`)

    const jobData = job.data
    const { onSuccess, onFailure, taskId, wfInstanceId } = jobData.data
    this.logger.debug(`Init: ${JSON.stringify({ data: jobData.data }, null, 2)}`)

    const nextTasks = jobData.success ? onSuccess : onFailure

    await this.wfmsService.completeTask(jobData.data, jobData.success)
    await this.wfmsService.initTasks(nextTasks, taskId, wfInstanceId, jobData.data.output)
  }
}
