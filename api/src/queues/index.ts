import Queue from "bull"
import logger from "../logger"

import config from "../config"

export type CreateTaskJob = {
  action: "CREATE"
  task: {
    name: string
    group: string
    state: "waiting" | "queued" | "delayed" | "running" | "failed" | "done"
    metadata: Record<string, any>
  }
}

export type UpdateTaskJob = {
  action: "UPDATE"
  id: number
  task: {
    name?: string
    group?: string
    state?: "waiting" | "queued" | "delayed" | "running" | "failed" | "done"
    metadata?: Record<string, any>
  }
}

export const tasksQueue = new Queue<CreateTaskJob | UpdateTaskJob>(
  "create task",
  {
    redis: {
      port: 6379,
      host: config.redis.host,
      password: config.redis.password,
    },
  },
)
  .on("error", function (error) {
    logger.error("Fatal queue error", error)
  })
  .on("failed", function (job, error) {
    logger.error("Error while processing job", error)
  })
