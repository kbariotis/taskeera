import { Request, Response } from "express"
import Joi from "@hapi/joi"
import Boom from "@hapi/boom"

import { processTaskLater } from "../../queues"

type CreateTaskBody = {
  name: string
  state: "queued" | "running" | "failed" | "done"
  group: string
  reference_id: string
  metadata: Record<string, any>
}

const createTaskSchema = Joi.object({
  name: Joi.string()
    .pattern(new RegExp("^[a-z0-9-_]*$"))
    .min(3)
    .max(30)
    .required(),
  state: Joi.string().valid("queued", "running", "failed", "done").required(),
  group: Joi.string()
    .pattern(new RegExp("^[a-z0-9-_]*$"))
    .min(3)
    .max(30)
    .required(),
  reference_id: Joi.string().min(1).max(128).required(),
  metadata: Joi.object(),
})

export const createTask = async (
  req: Request<{}, { success: boolean }, CreateTaskBody>,
  res: Response,
) => {
  const input = req.body

  const results = createTaskSchema.validate(input)

  if (results.error) {
    throw Boom.badRequest("Invalid input", results.error.message)
  }

  await processTaskLater({
    action: "CREATE",
    task: input,
  })

  res.status(202).json({
    success: true,
  })
}
