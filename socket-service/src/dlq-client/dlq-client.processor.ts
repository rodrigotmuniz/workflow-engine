import { Process, Processor } from '@nestjs/bull'
import { InternalServerErrorException, Logger, ServiceUnavailableException } from '@nestjs/common'
import { Job } from 'bull'
import { DlqsClientService } from 'src/dlq-client/dlq-client.service'
import { SocketGateway } from 'src/socket/socket.gateway'

@Processor(process.env.DLQ_QUEUE || 'DLQ_QUEUE')
export class DlqProcessor {
  private readonly logger = new Logger(DlqProcessor.name)

  constructor(
    private readonly dlqsClientService: DlqsClientService,
  ) {}

  @Process('*')
  async handleTask(job: Job) {
    // try {
      this.logger.log(`handleTask: ${JSON.stringify({ name: job.name }, null, 2)} | [PID ${process.pid}]`)

      const jobData = job.data
      // this.logger.debug(`Init: ${JSON.stringify({ data: jobData.data }, null, 2)}`)

  //   } catch (error) {
  //     const { name, data, attemptsMade, opts } = job
  //     const errorMessage = `handleTask: 
  //       ${JSON.stringify({ name, data, attemptsMade, attempts: opts.attempts, message: error.message }, null, 2)} | [PID ${process.pid}]`

  //     this.logger.error(errorMessage)

  //     if (job.attemptsMade < Number(job.opts.attempts || 1)) {
  //       this.dlqsClientService.emitEvent(job.name, { ...job.data, success: false })
  //       throw new ServiceUnavailableException(errorMessage)
  //     }
  //     throw new InternalServerErrorException(error.message || error)
  //   }
  }
}
