import { Module } from '@nestjs/common'
import { DefinitionsModule } from './definitions/definitions.module';

@Module({
  imports: [DefinitionsModule],
})
export class AppModule {}
