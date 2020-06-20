import { Request, Response } from "express"

import Joi from "@hapi/joi"
import Boom from "@hapi/boom"

import { tasksQueue, UpdateTaskJob } from "../../queues"

export type UpdateTaskBody = {
  id: number
  state?: "waiting" | "queued" | "delayed" | "running" | "failed" | "done"
}

const updateTaskSchema = Joi.object({
  state: Joi.string().alphanum().min(3).max(30),
}).or("name", "state", "group")

export const updateTask = (
  req: Request<{ id: string }, UpdateTaskBody>,
  res: Response,
) => {
  const input = req.body

  const results = updateTaskSchema.validate(input)

  if (results.error) {
    throw Boom.badRequest("Invalid input", results.error.message)
  }

  tasksQueue.add({
    action: "UPDATE",
    id: Number(req.params.id),
    task: input,
  } as UpdateTaskJob)

  res.status(202).json({
    success: true,
  })
}
