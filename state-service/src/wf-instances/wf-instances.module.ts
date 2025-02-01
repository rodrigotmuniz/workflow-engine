import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WfInstance } from './entities/wf-instance.entity'
import { WfInstancesService } from './services/wf-instances.service'
import { WfInstancesController } from './wf-instances.controller'

@Module({
  imports: [TypeOrmModule.forFeature([WfInstance])],
  controllers: [WfInstancesController],
  providers: [WfInstancesService],
})
export class WfInstancesModule {}
