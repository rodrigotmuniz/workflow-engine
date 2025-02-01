import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Status } from '../enums/status.enum'
import { Expose } from 'class-transformer'

@Entity('task_executions')
export class TaskExecution {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  definitionId: string

  @Column({ type: 'enum', enum: Status })
  status: Status

  @Column()
  // @Column({name: 'wf_instance_id'})
  // @Expose({ name: 'wfInstanceId' })
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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
