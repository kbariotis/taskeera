import { quickAddJob } from "graphile-worker"

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

export async function processTaskLater(payload: CreateTaskJob | UpdateTaskJob) {
  await quickAddJob(
    {
      connectionString: `postgres://${config.postgres.username}:${config.postgres.password}@${config.postgres.host}:5432/${config.postgres.db}`,
    },
    "processTask",
    payload,
  )
}
