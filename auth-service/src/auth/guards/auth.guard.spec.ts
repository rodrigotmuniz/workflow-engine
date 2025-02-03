import { ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Roles } from "../enums/roles.enum"
import { AuthService } from "../services/auth.service"
import { AuthGuard } from "./auth.guard"

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked-token'),
}

describe('AuthGuard', () => {
  let authGuard: AuthGuard
  let authService: AuthService
  let reflector: Reflector
  let executionContext: ExecutionContext

  beforeEach(() => {
    authService = new AuthService(mockJwtService as any)
    reflector = new Reflector()
    authGuard = new AuthGuard(reflector, authService)
    executionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ username: 'luis', password: 'zambrano' }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext
  })

  it('should allow access if roles are not set', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined)
    expect(authGuard.canActivate(executionContext)).toBe(true)
  })

  it('should allow access if login is valid', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([Roles.USER])
    jest.spyOn(authService, 'validateLogin').mockReturnValue(true)
    expect(authGuard.canActivate(executionContext)).toBe(true)
  })

  it('should deny access if login is invalid', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([Roles.USER])
    jest.spyOn(authService, 'validateLogin').mockReturnValue(false)
    expect(authGuard.canActivate(executionContext)).toBe(false)
  })
})