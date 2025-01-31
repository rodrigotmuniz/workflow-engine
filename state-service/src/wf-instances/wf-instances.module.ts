import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WfInstance } from './entities/wf-instance.entity';
import { WfInstancesController } from './wf-instances.controller';
import { WfInstancesService } from './wf-instances.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WfInstance]),
  ],
  controllers: [WfInstancesController],
  providers: [WfInstancesService],
})
export class WfInstancesModule {}
