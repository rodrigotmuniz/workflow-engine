import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { WfmsService } from './wfms.service'

@Processor(process.env.WFM_QUEUE || 'WFM_QUEUE')
export class WfmsProcessor {
  constructor(private readonly wfmsService: WfmsService) {}
  @Process('*')
  async handleTask(job: Job) {
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
      console.log(`Init: ${onSuccess} | ${taskId}}`)
      const a = await this.wfmsService.initTasks(onSuccess, taskId, wfInstanceId)
    } else {
    }
    // setTimeout(() => {

    console.log(`Server WFM_QUEUE_QUEUE [PID ${process.pid}]: Processing task ->`, job.name, job.data, await job.getState())
    // }, 5000);
  }
}
