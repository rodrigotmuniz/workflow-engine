import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Roles } from '../decorators/roles.decorator'
import { AuthService } from '../services/auth.service'


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler())
    if (!roles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    return this.authService.validateLogin(request, roles)
  }
}
