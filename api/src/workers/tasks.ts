import WebSocket from "ws"

import { tasksQueue, CreateTaskJob, UpdateTaskJob } from "../queues"
import { createTask, updateTask, TaskRecord } from "../models/tasks"
import logger from "../logger"
import { sockets } from "../sockets"

const childLogger = logger.child({
  queue: "createTasksQueue",
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

tasksQueue.process(async function (job) {
  childLogger.info("Starting to process job")

  const internalTask = await processCreateTask({
    action: "CREATE",
    task: {
      name: "process-task",
      state: "running",
      group: "__internal__",
      metadata: job.data.task,
    },
  })

  let response: TaskRecord

  try {
    switch (job.data.action) {
      case "CREATE": {
        response = await processCreateTask(job.data as CreateTaskJob)
        break
      }
      case "UPDATE": {
        response = await processUpdateTask(job.data as UpdateTaskJob)
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
    return response
  } catch (e) {
    await processUpdateTask({
      action: "UPDATE",
      id: internalTask.id,
      task: {
        state: "failed",
      },
    })

    throw e
  }
})
