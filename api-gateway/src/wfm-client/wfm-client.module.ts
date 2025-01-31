import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { WfmClientController } from './wfm-client.controller'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.WFM_CLIENT || 'WFM_CLIENT',
        options: {
          host: process.env.WFM_HOST ?? 'localhost',
          port: Number(process.env.WFM_PORT || 3009),
        },
      },
    ]),
  ],
  controllers: [WfmClientController],
})
export class WfmClientModule {}
