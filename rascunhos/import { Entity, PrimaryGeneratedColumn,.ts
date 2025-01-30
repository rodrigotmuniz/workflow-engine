import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WorkflowDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column()
  description: string;

  @OneToMany(() => TaskDefinition, (task) => task.workflow)
  tasks: TaskDefinition[];

  @OneToMany(() => Transition, (transition) => transition.workflow)
  transitions: Transition[];
}

@Entity()
export class TaskDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  service: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  retry?: number;

  @Column({ nullable: true })
  timeout?: number;

  @Column({ nullable: true })
  retryInterval?: number;

  @Column({ default: false })
  onFailure?: boolean;

  @ManyToOne(() => WorkflowDefinition, (workflow) => workflow.tasks, {
    onDelete: 'CASCADE',
  })
  workflow: WorkflowDefinition;
}

@Entity()
export class Transition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fromTask: string;

  @Column('simple-array')
  toTasks: string[];

  @Column()
  onSuccess: boolean;

  @ManyToOne(() => WorkflowDefinition, (workflow) => workflow.transitions, {
    onDelete: 'CASCADE',
  })
  workflow: WorkflowDefinition;
}

@Entity()
export class WorkflowInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkflowDefinition, { eager: true })
  workflow: WorkflowDefinition;

  @Column()
  currentState: string;

  @OneToMany(() => TaskInstance, (task) => task.workflowInstance)
  tasks: TaskInstance[];
}

@Entity()
export class TaskInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => WorkflowInstance,
    (workflowInstance) => workflowInstance.tasks,
    { onDelete: 'CASCADE' },
  )
  workflowInstance: WorkflowInstance;

  @Column()
  taskId: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  errorMessage?: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  role: string;
}

@Entity()
export class AuditRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  action: string;

  @Column()
  timestamp: Date;
}
