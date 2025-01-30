import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class TaskQueuesService {
  constructor(
    @Inject(process.env.TASK_QUEUE_CLIENT || 'TASK_QUEUE_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  async find() {
    const observable = this.clientProxy.send('findAllTaskQueues', 'ids')
    return await firstValueFrom(observable)
  }
}
