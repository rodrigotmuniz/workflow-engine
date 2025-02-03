import { Controller, Logger, UseGuards } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AuthPayloadDto } from './dto/auth-payload.dto'
import { AuthGuard } from './guards/auth.guard'

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private readonly authService: AuthService) {}

  @MessagePattern('[PATTERN].login')
  @UseGuards(AuthGuard)
  login(@Payload() payload: AuthPayloadDto) {
    return this.authService.login(payload)
  }
}
