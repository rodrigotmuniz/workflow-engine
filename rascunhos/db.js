api-gateway
auth-service

task-queue-service 
n x task-executor-service 
integration-service 
auth-db
user-db


const a = {
  "definition-service": {
    "definitions-db" : {
      id: number,
      definition: json,
      name: string
    },
    "definitions-history-db": {
      id: number,
      definition: json,
      name: string,
      definitionId: number,
      status: string // UPDATED, DELETED
    }
  },
  
 "wfm-service ":{
    "workflow-instances-db":{
      id: number,
      definitionId: number,
      currentStates: [string], // taskIds
      status: ENUM(['pending', 'running', 'failed', 'completed'])
    },
    "task-executions-db":{
      id: number,
      definitionId: string,
      workflowInstanceId: number ,

      dependencies: [string],
      toTaskId: [string], // names}
  
      taskId: string,
      taskType: string ,
      taskService: string,
      taskAction: string,
      taskRetry: number,
      taskTimeout: number,
  
      onFailure?: [string], // taskName
      onSuccess?: [string], // taskName

      status: ENUM(['pending', 'running', 'failed', 'completed']),
    },
  }
}