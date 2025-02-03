import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import * as jwt from 'jsonwebtoken'
import { Roles } from '../decorators/roles.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly secret = process.env.AUTH_SECRET || ''

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler())
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token')
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, this.secret)
      return roles.includes(decoded.role)
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
