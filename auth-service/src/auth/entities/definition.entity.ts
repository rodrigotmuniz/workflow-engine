import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  // ! TODO: Adicionar version

  @Column({ type: 'jsonb' })
  auth: object

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
