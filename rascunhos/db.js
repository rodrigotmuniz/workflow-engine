// api-gateway
// auth-service

// task-queue-service
// n x task-executor-service
// integration-service
// auth-db
// user-db

const a = {
  'definition-service': {
    'definitions-db': {
      id: number,
      definition: json,
      name: string
    },
    'definitions-history-db': {
      id: number,
      definition: json,
      name: string,
      definitionId: number,
      status: string // UPDATED, DELETED
    }
  },

  'wfm-service ': {
    'workflow-instances-db': {
      id: number,
      definitionName: string,
      currentStates: [string], // taskIds
      status: ENUM(['PENDING', 'RUNNING', 'FAILED', 'COMPLETED'])
    },
    'task-executions-db': {
      id: number,
      definitionId: string,
      workflowInstanceId: number,

      
      // taskId: string,
      // taskType: string,
      // taskService: string,
      // taskAction: string,
      // taskRetry: number,
      // taskTimeout: number,
      
      // onFailure: [string], // taskName
      // onSuccess: [string], // taskName

      // onSuccessDependencies: [string],
      // onFailureDependencies: [string],

      input: {},
      output: {},

      status: ENUM(['pending', 'running', 'failed', 'completed'])
    }
  }
}

const eventEmit = {
  id: number,

  taskId: string,
  taskType: string,
  taskService: string,
  taskAction: string,
  taskRetry: number,
  taskTimeout: number,

  input: {}
}

const eventResponse = {
  id: number,

  taskId: string,
  taskType: string,
  taskService: string,
  taskAction: string,
  taskRetry: number,
  taskTimeout: number,

  output: {}
}

const transitions = [
    { "from": ["A"], "to": ["B"], "onSuccess": true },
    { "from": ["B"], "to": ["C", "E"], "onSuccess": true },
    { "from": ["B"], "to": ["G"], "onFailure": true },
    { "from": ["C", "E"], "to": ["D"], "onSuccess": true },
    { "from": ["D"], "to": ["F"], "onSuccess": true }
  ]
