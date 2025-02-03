import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { AuthClientController } from './wfm-client.controller'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.AUTH_CLIENT || 'AUTH_CLIENT',
        options: {
          host: process.env.AUTH_HOST ?? 'localhost',
          port: Number(process.env.AUTH_PORT || 3001),
        },
      },
    ]),
  ],
  controllers: [AuthClientController],
})
export class AuthClientModule {}
