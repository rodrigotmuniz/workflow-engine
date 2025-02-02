import { Module } from '@nestjs/common'
import { SocketModule } from './socket/socket.module'
import { DlqsClientModule } from './dlq-client/dlq-client.module'

@Module({
  imports: [DlqsClientModule],
})
export class AppModule {}
