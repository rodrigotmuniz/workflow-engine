import { Status } from 'src/commons/enums/status.enum'

export interface TaskExecution {
  id: number
  definitionId: string
  status: Status
  wfInstanceId: number
  dependencies: string[]
  taskId: string
  taskType: string
  taskService: string
  taskAction: string
  taskRetry: number
  taskTimeout: number
  onFailure: string[]
  onSuccess: string[]
  input: object
  output: object
  createdAt: Date;
  updatedAt: Date;
}
