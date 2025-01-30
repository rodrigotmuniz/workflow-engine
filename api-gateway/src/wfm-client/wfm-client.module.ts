import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { WfmClientController } from './wfm-client.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: process.env.WFM_CLIENT || 'WFM_CLIENT',
        options: {
          host: process.env.WFM_HOST ?? 'localhost',
          port: Number(process.env.WFM_PORT || 3002),
        },
      },
    ]),
  ],
  controllers: [WfmClientController],
})
export class WfmClientModule {}
