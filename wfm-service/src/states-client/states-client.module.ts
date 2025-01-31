import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { WfInstancesClientService } from './wf-instances-client/wf-instances-client.service'

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
  providers: [WfInstancesClientService],
  exports: [WfInstancesClientService],
})
export class StatesClientModule {}
