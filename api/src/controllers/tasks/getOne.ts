import { Request, Response } from "express"

import { getOneTask as getOne } from "../../models/tasks"

export const getOneTask = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const task = await getOne(Number(req.params.id))

  res.json({
    success: true,
    task,
  })
}
