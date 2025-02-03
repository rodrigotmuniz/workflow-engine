import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '../services/auth.service'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '../guards/auth.guard'
import { Reflector } from '@nestjs/core'
import { AuthController } from '../auth.controller'
import { Roles } from '../enums/roles.enum'
import { ExecutionContext } from '@nestjs/common'

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked-token'),
}

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: mockJwtService }],
    }).compile()

    authService = module.get<AuthService>(AuthService)
  })

  it('should validate login successfully', () => {
    const result = authService.validateLogin({ username: 'luis', password: 'zambrano' }, [Roles.USER])
    expect(result).toBe(true)
  })

  it('should reject login with incorrect password', () => {
    const result = authService.validateLogin({ username: 'luis', password: 'wrong' }, [Roles.USER])
    expect(result).toBe(false)
  })

  it('should reject login with incorrect role', () => {
    const result = authService.validateLogin({ username: 'luis', password: 'zambrano' }, [Roles.ADMIN])
    expect(result).toBe(false)
  })

  it('should generate a JWT token on login', () => {
    const result = authService.login({ username: 'luis',password: 'zambrano' })
    expect(result).toBe('mocked-token')
    expect(mockJwtService.sign).toHaveBeenCalled()
  })
})

