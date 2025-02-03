import { Body, Controller, Inject, Logger, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AuthPayloadDto } from './dto/auth-payload.dto'

@Controller('auth')
export class AuthClientController {
  private readonly logger = new Logger(AuthClientController.name)

  constructor(
    @Inject(process.env.AUTH_CLIENT || 'AUTH_CLIENT')
    private readonly clientProxy: ClientProxy,
  ) {}

  @Post('login')
  login(@Body() dto: AuthPayloadDto) {
    this.logger.log(`login: ${JSON.stringify({ username: dto.username }, null, 2)}`)

    return this.clientProxy.send('[PATTERN].login', dto)
  }
}
