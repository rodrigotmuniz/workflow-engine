export const DefinitionsPattern = {
  CREATE: 'definition-service.create',
  FIND_ALL: 'definition-service.findAll',
  FIND_BY_NAME: 'definition-service.findByName',
  REMOVE: 'definition-service.remove',
  FIND_JSON: 'definition-service.findJsonDefinitionByName',
}

export const AuthPattern = {
  LOGIN: 'auth-service.login'
}

export const WfmPattern = {
  RUN: 'wfm-service.run'
}

export const TaskExecutionPattern = {
  CREATE: 'task-execution-service.create',
  CREATE_MANY: 'task-execution-service.createMany',
  FIND_BY_ID: 'task-execution-service.findById',
  REMOVE_DEPENDENCY: 'task-execution-service.removeDependency',
  FIND_BY_TASK_AND_WD_INSTANCE: 'task-execution-service.findOneByTaskIdAndWfInstanceId',
  REMOVE_DEPENDENCIES_BY_ID: 'task-execution-service.removeDependencyByIds',
  UPDATE_STATUS: 'task-execution-service.updateStatus',
  UPDATE: 'task-execution-service.update',
}

export const WfInstancePattern = {
  CREATE: 'wf-instance-service.create',
  UPDATE_STATE: 'wf-instance-service.updateState',
  UPDATE_CURRENT_STATE: 'wf-instance-service.updateCurrentState',
}
