import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { DefinitionsController } from './definitions.controller'

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
  controllers: [DefinitionsController],
})
export class DefinitionsModule {}
