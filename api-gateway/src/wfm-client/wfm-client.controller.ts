import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('wfm')
export class WfmClientController {
  constructor(
    @Inject(process.env.WFM_CLIENT_CLIENT || 'WFM_CLIENT_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  @Get()
  findAll() {
    return this.clientProxy.send('findAllWfms', {});
  }
}
