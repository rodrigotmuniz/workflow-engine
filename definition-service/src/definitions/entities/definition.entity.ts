import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('definitions')
export class Definition {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ type: 'jsonb' })
  definition: object
}
