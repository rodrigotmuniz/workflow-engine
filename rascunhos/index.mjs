const definition = {
  id: 'order_processing',
  name: 'E-commerce Order Processing',
  version: '1.5',
  description:
    'Handles order validation, inventory check, payment processing, refund handling, and fulfillment with proper inventory management.',
  tasks: [
    {
      id: 'A',
      type: 'service_call',
      service: 'order-service',
      action: 'validate',
      retry: 3,
      timeout: 5000,
      required: true
    },
    {
      id: 'B',
      type: 'database_query',
      service: 'inventory-service',
      action: 'check_stock',
      retry: 2,
      timeout: 3000,
      required: true
    },
    {
      id: 'E',
      type: 'service_call',
      service: 'order-service',
      action: 'cancel',
      onFailure: true,
      required: false
    },
    {
      id: 'C',
      type: 'external_api',
      service: 'payment-gateway',
      action: 'charge',
      retry: 2,
      timeout: 7000,
      retryInterval: 300000,
      required: true
    },
    {
      id: 'D',
      type: 'service_call',
      service: 'discount-service',
      action: 'apply',
      retry: 2,
      timeout: 4000
    },
    {
      id: 'F',
      type: 'database_update',
      service: 'inventory-service',
      action: 'deduct_stock',
      required: true
    },
    {
      id: 'I',
      type: 'external_api',
      service: 'payment-gateway',
      action: 'refund',
      onFailure: true,
      required: false
    },
    {
      id: 'J',
      type: 'database_update',
      service: 'inventory-service',
      action: 'restock',
      onFailure: true,
      required: false
    },
    {
      id: 'H',
      type: 'notification',
      service: 'email-service',
      action: 'send',
      retry: 1,
      required: true
    },
    {
      id: 'G',
      type: 'notification',
      service: 'admin-alert-service',
      action: 'send_alert',
      onFailure: true,
      required: false
    }
  ],
  transitions: [
    { from: ['A'], to: ['B'], onSuccess: true },
    { from: ['B'], to: ['C', 'D'], onSuccess: true },
    { from: ['B'], to: ['E'], onFailure: true },
    { from: ['C', 'D'], to: ['F'], onSuccess: true },
    { from: ['C', 'D'], to: ['G'], onFailure: true },
    { from: ['F'], to: ['H'], onSuccess: true },
    { from: ['F'], to: ['I'], onFailure: true },
    { from: ['I'], to: ['J'], onSuccess: true },
    { from: ['I'], to: ['G'], onFailure: true }
  ],
  validations: {
    no_cycles: true,
    all_tasks_defined: true,
    valid_parallel_execution: true,
    required_tasks_must_complete: true
  }
}

const executions = [
]

for (let task of definition.tasks) {
  const execution = {
    taskId: task.id,
    from: [],
    onSuccess: [],
    onFailure: []
  }
  for (let transition of definition.transitions) {
    const { from, to, onFailure, onSuccess } = transition
    if (to.includes(task.id)) {
      execution.from.push(...from)
    }
    if (from.includes(task.id)) {
      if (onSuccess) {
        execution.onSuccess.push(...to)
      } else if (onFailure) {
        execution.onFailure.push(...to)
      }
    }
  }
  executions.push(execution)
}

console.log(executions)

console.log(`${JSON.stringify('{"id":"order_processing","name":"E-commerce Order Processing","version":"1.5","description":"Handles order validation, inventory check, payment processing, refund handling, and fulfillment with proper inventory management.","tasks":[{"id":"A","type":"service_call","service":"order-service","action":"validate","retry":3,"timeout":5000,"required":true},{"id":"B","type":"database_query","service":"inventory-service","action":"check_stock","retry":2,"timeout":3000,"required":true},{"id":"E","type":"service_call","service":"order-service","action":"cancel","onFailure":true,"required":false},{"id":"C","type":"external_api","service":"payment-gateway","action":"charge","retry":2,"timeout":7000,"retryInterval":300000,"required":true},{"id":"D","type":"service_call","service":"discount-service","action":"apply","retry":2,"timeout":4000},{"id":"F","type":"database_update","service":"inventory-service","action":"deduct_stock","required":true},{"id":"I","type":"external_api","service":"payment-gateway","action":"refund","onFailure":true,"required":false},{"id":"J","type":"database_update","service":"inventory-service","action":"restock","onFailure":true,"required":false},{"id":"H","type":"notification","service":"email-service","action":"send","retry":1,"required":true},{"id":"G","type":"notification","service":"admin-alert-service","action":"send_alert","onFailure":true,"required":false}],"transitions":[{"from":["A"],"to":["B"],"onSuccess":true},{"from":["B"],"to":["C","D"],"onSuccess":true},{"from":["B"],"to":["E"],"onFailure":true},{"from":["C","D"],"to":["F"],"onSuccess":true},{"from":["C","D"],"to":["G"],"onFailure":true},{"from":["F"],"to":["H"],"onSuccess":true},{"from":["F"],"to":["I"],"onFailure":true},{"from":["I"],"to":["J"],"onSuccess":true},{"from":["I"],"to":["G"],"onFailure":true}],"validations":{"no_cycles":true,"all_tasks_defined":true,"valid_parallel_execution":true,"required_tasks_must_complete":true}}')}`)
// console.log(definition)
