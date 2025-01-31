import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DefinitionsController } from './definitions.controller'
import { DefinitionsService } from './definitions.service'
import { Definition } from './entities/definition.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DEFINITIONS_DB_TYPE as 'postgres',
      host: process.env.DEFINITIONS_DB_HOST,
      port: Number(process.env.DEFINITIONS_DB_PORT),
      username: process.env.DEFINITIONS_DB_USERNAME,
      database: process.env.DEFINITIONS_DB_NAME,
      password: process.env.DEFINITIONS_DB_PASSWORD,
      autoLoadEntities: Boolean(process.env.DEFINITIONS_DB_AUTOLOADENTITIES),
      synchronize: Boolean(process.env.DEFINITIONS_DB_SYNCHRONIZE),
    }),
    TypeOrmModule.forFeature([Definition]),
  ],
  controllers: [DefinitionsController],
  providers: [DefinitionsService],
})
export class DefinitionsModule {}
