import db from "../db"
import logger from "../logger"

export interface TaskRecord {
  id: number
  name: string
  state: "waiting" | "queued" | "delayed" | "running" | "failed" | "done"
  group: string
  metadata: string
  created_at: Date
  updated_at: Date
}

export const getAllTasks = (group?: string) => {
  logger.info("getAllTasks")

  const query = db<TaskRecord>("tasks").select()

  if (group) {
    query.where("group", group)
  }

  return query.orderBy("created_at", "desc").limit(20)
}

export const getOneTask = (id: number) => {
  logger.info("getOneTask")

  return db<TaskRecord>("tasks")
    .select()
    .where("id", id)
    .then(results => results[0])
}

export const aggregateByGroup = () => {
  logger.info("aggregateByGroup")

  return db<TaskRecord>("tasks")
    .select("group", "state", db.raw("COUNT(*)"))
    .groupBy("group", "state")
    .orderBy("group", "asc")
}

export const searchOnMetadata = (query: Record<string, string>) => {
  logger.info("searchOnMetadata")

  return db<TaskRecord>("tasks")
    .select()
    .whereRaw(
      Object.keys(query)
        .map(item => `metadata->>'${item}' = ?`)
        .join(" AND "),
      Object.values(query),
    )
    .orderBy("created_at", "desc")
    .limit(20)
}

interface TaskCreateInput {
  name: string
  metadata: Record<string, any>
  state: "waiting" | "queued" | "delayed" | "running" | "failed" | "done"
  group: string
}

export const createTask = async (
  task: TaskCreateInput,
): Promise<TaskRecord> => {
  logger.info("createTask")

  const [record] = await db<TaskRecord>("tasks")
    .returning("*")
    .insert({
      ...task,
      metadata: JSON.stringify(task.metadata || {}),
      created_at: new Date(),
    })

  return record
}

interface TaskUpdateInput {
  state?: "waiting" | "queued" | "delayed" | "running" | "failed" | "done"
}

export const updateTask = async (
  id: number,
  task: TaskUpdateInput,
): Promise<TaskRecord> => {
  logger.info("updateTask")

  const [record] = await db<TaskRecord>("tasks")
    .returning("*")
    .where("id", id)
    .update({
      state: task.state,
      updated_at: new Date(),
    })

  return record
}
