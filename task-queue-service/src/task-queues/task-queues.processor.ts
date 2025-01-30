import { Process, Processor } from '@nestjs/bull';

@Processor(process.env.TASK_QUEUE_CLIENT || 'TASK_QUEUE_CLIENT')
export class ServerBProcessor {
  @Process('process_task')
  async handleTask(job: any) {
    console.log(`Server TASK_QUEUE [PID ${process.pid}]: Processing task ->`, job.data); 
  }
}
