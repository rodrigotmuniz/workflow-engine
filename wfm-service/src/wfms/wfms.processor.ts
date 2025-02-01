import { Process, Processor } from '@nestjs/bull';

@Processor(process.env.WFM_QUEUE || 'WFM_QUEUE')
export class WfmsProcessor {
  @Process('*')
  async handleTask(job: any) {
    // setTimeout(() => {
      
      console.log(`Server WFM_QUEUE_QUEUE [PID ${process.pid}]: Processing task ->`,job.name, job.data);
    // }, 5000); 
  }
}
