import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { EventEmitterService } from './event-emitter.service'

@Processor(process.env.TASK_QUEUE || 'TASK_QUEUE')
export class TaskQueuesProcessor {
  constructor(private readonly eventEmitterService: EventEmitterService) {} // private readonly taskEventEmitter: TaskEventEmitter

  @Process('*')
  async handleTask(job: Job) {
    console.log(`Server TASK_QUEUE [PID ${process.pid}]: Processing task ->`, job.name, job.data)

    console.log('Process...')
    setTimeout(() => {
      this.eventEmitterService.emitEvent(job.name, job.data)
      console.log('Done!')
    }, 1000)
    // console.log('onTaskCompleted')
    // this.taskEventEmitter.onTaskCompleted('bla', 'ble', (data) => console.log(1111111111, data))
    // setTimeout(() => {
    // console.log('emitTaskCompleted')
    // this.taskEventEmitter.emitTaskCompleted('bla', 'ble')
    // }, 500);
  }
}
