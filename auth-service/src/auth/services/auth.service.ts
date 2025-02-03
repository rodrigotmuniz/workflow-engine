import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthPayloadDto } from '../dto/auth-payload.dto'
import { Roles } from '../enums/roles.enum'

const fakeUsers = [
  {
    id: 1,
    username: 'luis',
    password: 'zambrano',
    role: Roles.USER,
  },
  {
    id: 2,
    username: 'roberto',
    password: 'filho',
    role: Roles.ADMIN,
  },
]
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(private readonly jwtService: JwtService) {}

  validateLogin({ password, username }: AuthPayloadDto, roles: string[]): boolean {
    const foundUser = fakeUsers.find((user) => user.username === username)
    return !!foundUser && foundUser.password === password && roles.includes(foundUser.role)
  }

  login({ username }: AuthPayloadDto) {
    const foundUser = fakeUsers.find((user) => user.username === username)
    const { password, ...user } = foundUser!
    return this.jwtService.sign(user)
  }
}
