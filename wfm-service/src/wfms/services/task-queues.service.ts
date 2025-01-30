import { InjectQueue } from '@nestjs/bull'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Queue } from 'bull'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class TaskQueuesService {
  private readonly logger = new Logger(TaskQueuesService.name)

  constructor(
    // @Inject(process.env.TASK_QUEUE_CLIENT || 'TASK_QUEUE_CLIENT')
    // private readonly clientProxy: ClientProxy,
    @InjectQueue(process.env.TASK_QUEUE_CLIENT || 'TASK_QUEUE_CLIENT')
    private taskQueue: Queue,
  ) {}

  async find() {
    this.logger.log('findAll()')
    // const observable = this.clientProxy.send('findAllTaskQueues', 'ids')
    // return await firstValueFrom(observable)
    console.log('Server A: Adding job to queue')
    await this.taskQueue.add('process_task', { message: 'Task from Server WFM' })
    return {}
  }
}
