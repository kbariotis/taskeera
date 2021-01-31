import { quickAddJob } from "graphile-worker"

import config from "../config"

export type CreateTaskJob = {
  action: "CREATE"
  task: {
    name: string
    group: string
    state: "queued" | "running" | "failed" | "done"
    reference_id: string
    metadata: Record<string, any>
  }
}

export type UpdateTaskJob = {
  action: "UPDATE"
  id: string
  task: {
    state?: "queued" | "running" | "failed" | "done"
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
