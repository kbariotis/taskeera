import WebSocket from "ws"

import { CreateTaskJob, UpdateTaskJob } from "../queues"
import { createTask, updateTask } from "../models/tasks"
import logger from "../logger"

import { sockets } from "../sockets"

const childLogger = logger.child({
  queue: "tasksWorker",
})

type TaskCreatedEvent = {
  event: "TASK_CREATED"
  data: Record<string, any>
}

type TaskUpdatedEvent = {
  event: "TASK_UPDATED"
  data: Record<string, any>
}

async function processCreateTask(input: CreateTaskJob) {
  const response = await createTask(input.task)
  sockets.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      const event: TaskCreatedEvent = {
        event: "TASK_CREATED",
        data: response,
      }
      client.send(JSON.stringify(event))
    }
  })

  return response
}

async function processUpdateTask(input: UpdateTaskJob) {
  const response = await updateTask(input.id, input.task)
  sockets.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      const event: TaskUpdatedEvent = {
        event: "TASK_UPDATED",
        data: response,
      }
      client.send(JSON.stringify(event))
    }
  })

  return response
}

export default async (job: any) => {
  childLogger.info("Starting to process job")

  const internalTask = await processCreateTask({
    action: "CREATE",
    task: {
      name: "process-task",
      state: "running",
      group: "__internal__",
      metadata: job.task,
    },
  })

  try {
    switch (job.action) {
      case "CREATE": {
        await processCreateTask(job as CreateTaskJob)
        break
      }
      case "UPDATE": {
        await processUpdateTask(job as UpdateTaskJob)
        break
      }
      default:
        throw new Error("action not implemented")
    }

    await processUpdateTask({
      action: "UPDATE",
      id: internalTask.id,
      task: {
        state: "done",
      },
    })
  } catch (e) {
    childLogger.error("Error while processing job")
    await processUpdateTask({
      action: "UPDATE",
      id: internalTask.id,
      task: {
        state: "failed",
      },
    })

    throw e
  }
}
