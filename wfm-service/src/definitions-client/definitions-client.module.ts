import { Module } from '@nestjs/common'
import { DefinitionsClientController } from './definitions-client.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.DEFINITION_CLIENT || 'DEFINITION_CLIENT',
        options: {
          host: process.env.DEFINITION_HOST ?? 'localhost',
          port: Number(process.env.DEFINITION_PORT || 3004),
        },
      },
    ]),
  ],
  controllers: [DefinitionsClientController],
})
export class DefinitionsClientModule {}
