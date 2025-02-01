import { Module } from '@nestjs/common'
import { WfInstancesModule } from './wf-instances/wf-instances.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { TaskExecutionsModule } from './task-executions/task-executions.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.STATES_DB_TYPE as 'postgres',
      host: process.env.STATES_DB_HOST,
      port: Number(process.env.STATES_DB_PORT),
      username: process.env.STATES_DB_USERNAME,
      database: process.env.STATES_DB_NAME,
      password: process.env.STATES_DB_PASSWORD,
      autoLoadEntities: Boolean(process.env.STATES_DB_AUTOLOADENTITIES),
      synchronize: Boolean(process.env.STATES_DB_SYNCHRONIZE),
    }),
    WfInstancesModule,
    TaskExecutionsModule,
  ],
})
export class AppModule {}
