import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Status } from '../enums/status.enum'

@Entity('task_executions')
export class TaskExecution {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  definitionId: string

  @Column({ type: 'enum', enum: Status })
  status: Status

  @Column({name: 'wf_instance_id'})
  wfInstanceId: number

  @Column("text", { array: true })
  dependencies: string[]

  @Column()
  taskId: string

  @Column()
  taskType: string

  @Column()
  taskService: string

  @Column()
  taskAction: string

  @Column({ nullable: true })
  taskRetry: number

  @Column({ nullable: true })
  taskTimeout: number

  @Column('simple-array', { default: [] })
  onFailure: string[]

  @Column('simple-array', { default: [] })
  onSuccess: string[]

  @Column({ type: 'jsonb', nullable: true })
  input: object

  @Column({ type: 'jsonb', nullable: true })
  output: object
}
