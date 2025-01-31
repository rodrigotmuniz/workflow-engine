import { Module } from '@nestjs/common'
import { DefinitionsController } from './definitions.controller'
import { DefinitionsService } from './definitions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Definition } from './entities/definition.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: Boolean(process.env.DB_AUTOLOADENTITIES),
      synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    }),
    TypeOrmModule.forFeature([Definition]),
  ],
  controllers: [DefinitionsController],
  providers: [DefinitionsService],
})
export class DefinitionsModule {}
