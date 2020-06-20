import { Request, Response } from "express"
import Joi from "@hapi/joi"
import Boom from "@hapi/boom"

import { tasksQueue, CreateTaskJob } from "../../queues"

type CreateTaskBody = {
  name: string
  state: "waiting" | "queued" | "delayed" | "running" | "failed" | "done"
  group: string
  metadata: Record<string, any>
}

const createTaskSchema = Joi.object({
  name: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9-_]*$"))
    .min(3)
    .max(30)
    .required(),
  state: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9-_]*$"))
    .min(3)
    .max(30)
    .required(),
  group: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9-_]*$"))
    .min(3)
    .max(30)
    .required(),
  metadata: Joi.object(),
})

export const createTask = (req: Request<{}, CreateTaskBody>, res: Response) => {
  const input = req.body

  const results = createTaskSchema.validate(input)

  if (results.error) {
    throw Boom.badRequest("Invalid input", results.error.message)
  }

  tasksQueue.add({
    action: "CREATE",
    task: input,
  } as CreateTaskJob)

  res.status(202).json({
    success: true,
  })
}
