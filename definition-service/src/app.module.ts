import { Module } from '@nestjs/common'
import { DefinitionsModule } from './definitions/definitions.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot(), DefinitionsModule],
})
export class AppModule {}
