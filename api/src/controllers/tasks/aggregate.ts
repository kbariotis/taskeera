import { Request, Response } from "express"

import { aggregateByGroup } from "../../models/tasks"

export const aggregateTasks = async (_: Request, res: Response) => {
  const tasks = await aggregateByGroup()

  res.json({
    success: true,
    tasks,
  })
}
