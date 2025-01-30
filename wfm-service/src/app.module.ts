import { Module } from '@nestjs/common';
import { WfmsModule } from './wfms/wfms.module';

@Module({
  imports: [WfmsModule],
})
export class AppModule {}
