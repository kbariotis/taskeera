import { Request, Response } from "express"

import Joi from "@hapi/joi"
import Boom from "@hapi/boom"

import { processTaskLater } from "../../queues"

export type UpdateTaskBody = {
  state?: "queued" | "running" | "failed" | "done"
}

const updateTaskSchema = Joi.object({
  state: Joi.string().alphanum().min(3).max(30),
}).or("name", "state", "group")

export const updateTask = async (
  req: Request<{ id: string }, { success: boolean }, UpdateTaskBody>,
  res: Response,
) => {
  const input = req.body

  const results = updateTaskSchema.validate(input)

  if (results.error) {
    throw Boom.badRequest("Invalid input", results.error.message)
  }

  await processTaskLater({
    action: "UPDATE",
    id: req.params.id,
    task: input,
  })

  res.status(202).json({
    success: true,
  })
}
