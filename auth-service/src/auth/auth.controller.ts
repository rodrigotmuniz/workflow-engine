import { Controller, Logger } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateAuthDto } from './dto/create-definition.dto'

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private readonly authService: AuthService) {}

  @MessagePattern('AuthPattern.CREATE')
  create() {
    this.logger.log('create()')
    return {message: 'ok'}
  }

}
