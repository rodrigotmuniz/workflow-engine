import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './services/auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: process.env.AUTH_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
