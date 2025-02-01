import { Status } from '../enums/status.enum'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('wf_instances')
export class WfInstance {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  definitionId: string

  @Column("text", { array: true })
  currentStates: string[]

  @Column({ type: 'enum', enum: Status })
  status: Status

  // ! TODO: Adicionar version

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
