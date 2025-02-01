import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('definitions')
export class Definition {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  // ! TODO: Adicionar version

  @Column({ type: 'jsonb' })
  definition: object

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
