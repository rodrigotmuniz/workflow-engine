import { Module } from '@nestjs/common'
import { ClientProxy, ClientsModule } from '@nestjs/microservices'
import { DefinitionsClientService } from './definitions-client.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.DEFINITION_CLIENT || 'DEFINITION_CLIENT',
        options: {
          host: process.env.DEFINITION_HOST ?? 'localhost',
          port: Number(process.env.DEFINITION_PORT || 3003),
        },
      },
    ]),
  ],
  providers: [DefinitionsClientService],
  exports: [DefinitionsClientService]
})
export class DefinitionsClientModule {}
