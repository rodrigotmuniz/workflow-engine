import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { RunInWfmDto } from './dto/run-in-wfm.dto'
import { UpdateWfmDto } from './dto/update-wfm.dto'
import { WfmsService } from './wfms.service'

@Controller()
export class WfmsController {
  private readonly logger = new Logger(WfmsController.name)

  constructor(private readonly wfmsService: WfmsService) {}

  // @MessagePattern('createWfm')
  // create(@Payload() createWfmDto: any) {
  //   return this.wfmsService.create(createWfmDto) 
  // }

  @MessagePattern('[PATTERN]wfm.run')
  run(@Payload() runInWfmDto: RunInWfmDto) {
    this.logger.log(`run(): ${JSON.stringify(runInWfmDto, null, 2)}`)

    return this.wfmsService.run(runInWfmDto)
  }

  // @MessagePattern('findOneWfm')
  // findOne(@Payload() id: number) {
  //   return this.wfmsService.findOne(id)
  // }

  // @MessagePattern('updateWfm')
  // update(@Payload() updateWfmDto: UpdateWfmDto) {
  //   return this.wfmsService.update(updateWfmDto.id, updateWfmDto)
  // }

  // @MessagePattern('removeWfm')
  // remove(@Payload() id: number) {
  //   return this.wfmsService.remove(id)
  // }
}
