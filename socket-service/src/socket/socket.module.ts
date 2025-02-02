import { Module } from '@nestjs/common'
import { SocketGateway } from './socket.gateway'
import { DlqsClientModule } from 'src/dlq-client/dlq-client.module'

@Module({
  imports: [DlqsClientModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
