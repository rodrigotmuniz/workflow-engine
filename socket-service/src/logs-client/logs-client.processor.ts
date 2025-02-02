import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { SocketGateway } from 'src/socket/socket.gateway'

@Processor(process.env.LOGS_QUEUE || 'LOGS_QUEUE')
export class LogProcessor {
  private readonly logger = new Logger(LogProcessor.name)

  constructor(private readonly socketGateway: SocketGateway) {}

  @Process('*')
  async handleTask(job: Job) {
    this.logger.log(`handleTask: ${JSON.stringify({ name: job.name, data: job.data }, null, 2)} | [PID ${process.pid}]`)
    this.logger.debug(`handleTask: ${JSON.stringify(job, null, 2)} | [PID ${process.pid}]`)

    const { name, data } = job
    if (typeof data === 'string') {
      this.socketGateway.emitLog(data)
    } else {
      const { definitionId, status, wfInstanceId, taskService: service, taskAction: action, input, id, success } = data
      const response = { name, definitionId, status, wfInstanceId, service, action, input, id, success }
  
      this.socketGateway.emitLog(response)
    }

    // this.socketGateway.emitLog('bla')
    // {
    //   "id": "2",
    //   "name": "A",
    //   "data": {
    //     "definitionId": "order_processing",
    //     "status": "PENDING",
    //     "wfInstanceId": 184,
    //     "dependencies": [],
    //     "taskId": "A",
    //     "taskType": "service_call",
    //     "taskService": "order-service",
    //     "taskAction": "validate",
    //     "taskRetry": 3,
    //     "taskTimeout": 5000,
    //     "onFailure": [],
    //     "onSuccess": [
    //       "B"
    //     ],
    //     "taskRetryInterval": null,
    //     "input": null,
    //     "output": null,
    //     "id": 1474,
    //     "createdAt": "2025-02-02T19:02:12.056Z",
    //     "updatedAt": "2025-02-02T19:02:12.056Z",
    //     "success": false
    //   },
    //   "opts": {
    //     "removeOnComplete": true,
    //     "attempts": 3,
    //     "backoff": {
    //       "type": "fixed",
    //       "delay": 2000
    //     },
    //     "delay": 0,
    //     "timestamp": 1738522932177
    //   },
    //   "progress": 0,
    //   "delay": 0,
    //   "timestamp": 1738522932177,
    //   "attemptsMade": 0,
    //   "stacktrace": [],
    //   "returnvalue": null,
    //   "debounceId": null,
    //   "finishedOn": null,
    //   "processedOn": 1738522932182
    // }
    console.log()
  }
}
