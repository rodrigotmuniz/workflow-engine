import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WfmsService } from './wfms.service';
import { CreateWfmDto } from './dto/create-wfm.dto';
import { UpdateWfmDto } from './dto/update-wfm.dto';

@Controller()
export class WfmsController {
  private readonly logger = new Logger(WfmsController.name)
  
  constructor(private readonly wfmsService: WfmsService) {}

  @MessagePattern('createWfm')
  create(@Payload() createWfmDto: CreateWfmDto) {
    return this.wfmsService.create(createWfmDto);
  }

  @MessagePattern('findAllWfms')
  findAll() {
    this.logger.log('findAll()')
    
    return this.wfmsService.findAll();
  }

  @MessagePattern('findOneWfm')
  findOne(@Payload() id: number) {
    return this.wfmsService.findOne(id);
  }

  @MessagePattern('updateWfm')
  update(@Payload() updateWfmDto: UpdateWfmDto) {
    return this.wfmsService.update(updateWfmDto.id, updateWfmDto);
  }

  @MessagePattern('removeWfm')
  remove(@Payload() id: number) {
    return this.wfmsService.remove(id);
  }
}
