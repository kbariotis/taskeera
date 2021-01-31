import db from "../db"
import logger from "../logger"

const childLogger = logger.child({
  queue: "tasksModel",
})

export interface TaskRecord {
  id: number
  name: string
  state: "queued" | "running" | "failed" | "done"
  group: string
  reference_id: string
  metadata: string
  created_at: Date
  updated_at: Date
}

export const getAllTasks = (group?: string) => {
  childLogger.info("getAllTasks")

  const query = db<TaskRecord>("tasks").select()

  if (group) {
    query.where("group", group)
  }

  return query.orderBy("created_at", "desc").limit(20)
}

export const getOneTask = (id: number) => {
  childLogger.info("getOneTask")

  return db<TaskRecord>("tasks")
    .select()
    .where("id", id)
    .then(results => results[0])
}

export const aggregateByGroup = () => {
  childLogger.info("aggregateByGroup")

  return db<TaskRecord>("tasks")
    .select("group", "state", db.raw("COUNT(*)"))
    .groupBy("group", "state")
    .orderBy("group", "asc")
}

export const searchOnMetadata = (query: Record<string, string>) => {
  childLogger.info("searchOnMetadata")

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
  state: "queued" | "running" | "failed" | "done"
  group: string
  reference_id: string
}

export const createTask = async (
  task: TaskCreateInput,
): Promise<TaskRecord> => {
  childLogger.info("createTask")

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
  state?: "queued" | "running" | "failed" | "done"
}

export const updateTaskByReferenceId = async (
  referenceId: string,
  task: TaskUpdateInput,
): Promise<TaskRecord> => {
  childLogger.info("updateTask")

  const [record] = await db<TaskRecord>("tasks")
    .returning("*")
    .where("reference_id", referenceId)
    .update({
      state: task.state,
      updated_at: new Date(),
    })

  return record
}
