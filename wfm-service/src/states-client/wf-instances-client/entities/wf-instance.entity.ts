import { Status } from 'src/states-client/enums/status.enum'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

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
}
