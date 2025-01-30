import { Module } from '@nestjs/common';
import { WfmClientModule } from './wfm-client/wfm-client.module';

@Module({
  imports: [WfmClientModule],
})
export class AppModule {}
