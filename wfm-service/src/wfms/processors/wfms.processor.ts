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
    //   {
    //     definitionId: 'order_processing',
    //     status: 'PENDING',
    //     wfInstanceId: 68,
    //     dependencies: [],
    //     taskId: 'A',
    //     taskType: 'service_call',
    //     taskService: 'order-service',
    //     taskAction: 'validate',
    //     taskRetry: 3,
    //     taskTimeout: 5000,
    //     onFailure: [],
    //     onSuccess: [ 'B' ],
    //     input: null,
    //     output: null,
    //     id: 101
    //   },
    //   succeed: true
    // }

    const jobData = job.data
    if (jobData.succeed) {
      const { onSuccess, taskId, wfInstanceId } = jobData.data
      this.logger.debug(`Init: ${onSuccess} | ${taskId}}`)
      const a = await this.wfmsService.initTasks(onSuccess, taskId, wfInstanceId)
    } else {
    }
  }
}
