import { Status } from 'src/commons/enums/status.enum'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('wf_instances')
export class WfInstance {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  definitionId: string

  @Column('simple-array')
  currentStates: string[]

  @Column({ type: 'enum', enum: Status })
  status: Status

  // ! TODO: Adicionar version

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
