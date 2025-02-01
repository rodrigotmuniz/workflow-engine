import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaskEventEmitter {
  constructor(private eventEmitter: EventEmitter2) {}

  emitTaskCompleted(workflowId: string, taskId: string) {
    console.log(`Emitting event: task.completed.${workflowId}.${taskId}`);
    this.eventEmitter.emit(`task.completed.${workflowId}.${taskId}`, { workflowId, taskId });
  }

  onTaskCompleted(workflowId: string, taskId: string, callback: (data: any) => void) {
    const eventName = `task.completed.${workflowId}.${taskId}`;
    console.log(`Listening for event: ${eventName}`);
    this.eventEmitter.on(eventName, callback);
  }
}
