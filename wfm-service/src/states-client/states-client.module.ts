import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { WfInstancesClientService } from './wf-instances-client/wf-instances-client.service'
import { TaskExecutionsClientService } from './task-executions-client/task-executions-client.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.STATE_CLIENT || 'STATE_CLIENT',
        options: {
          host: process.env.STATE_HOST ?? 'localhost',
          port: Number(process.env.STATE_PORT || 3004),
        },
      },
    ]),
  ],
  providers: [WfInstancesClientService, TaskExecutionsClientService],
  exports: [WfInstancesClientService, TaskExecutionsClientService],
})
export class StatesClientModule {}
