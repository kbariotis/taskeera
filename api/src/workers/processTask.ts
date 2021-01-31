import { v4 as uuidv4 } from "uuid"

import { CreateTaskJob, UpdateTaskJob } from "../queues"
import { createTask, updateTaskByReferenceId } from "../models/tasks"
import logger from "../logger"

import { broadcast } from "../sockets"

const childLogger = logger.child({
  queue: "tasksWorker",
})

async function processCreateTask(input: CreateTaskJob) {
  const response = await createTask(input.task)
  broadcast({
    event: "TASK_CREATED",
    data: response,
  })

  return response
}

async function processUpdateTask(input: UpdateTaskJob) {
  const response = await updateTaskByReferenceId(input.id, input.task)
  broadcast({
    event: "TASK_UPDATED",
    data: response,
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
      reference_id: uuidv4(),
      metadata: {
        task_reference_id: job.task.reference_id,
      },
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
      id: internalTask.reference_id,
      task: {
        state: "done",
      },
    })
  } catch (e) {
    childLogger.error("Error while processing job")
    await processUpdateTask({
      action: "UPDATE",
      id: internalTask.reference_id,
      task: {
        state: "failed",
      },
    })

    throw e
  }
}
