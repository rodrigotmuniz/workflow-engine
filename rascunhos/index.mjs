// import { Process, Processor } from '@nestjs/bull';

const taskStatus = new Map() // Tracks completed tasks
const WORKFLOWS = {
  myWorkflow: {
    A: { next: ['B', 'C'] },
    B: { next: ['D'] },
    C: { next: ['D'] },
    D: { next: [] }
  }
}

// @Processor('workflow_queue')
export class WorkflowProcessor {
  // @Process('execute_task')
  async handleTask(job) {
    const { workflowId, taskId } = job.data
    console.log(`Executing task: ${taskId}`)

    // Simulate task execution delay
    await new Promise((res) => setTimeout(res, 1000))

    // Mark task as completed
    taskStatus.set(taskId, true)
    console.log(`Task ${taskId} completed`)

    // Trigger dependent tasks
    const workflow = WORKFLOWS[workflowId]
    if (workflow[taskId]) {
      for (const nextTask of workflow[taskId].next) {
        // Check if all incoming dependencies are met
        const incomingTasks = Object.keys(workflow).filter((key) =>
          workflow[key].next.includes(nextTask)
        )
        const allDepsCompleted = incomingTasks.every((dep) =>
          taskStatus.get(dep)
        )

        if (allDepsCompleted) {
          console.log(`Starting next task: ${nextTask}`)
          console.warn('execute_task', { workflowId, taskId: nextTask })
        }
      }
    }
  }
}

const processor = new WorkflowProcessor()
processor.handleTask({ data: { workflowId: 'myWorkflow', taskId: 'B' } })
