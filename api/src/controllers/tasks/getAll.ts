import { Request, Response } from "express"

import { getAllTasks as getAll, searchOnMetadata } from "../../models/tasks"

export const getAllTasks = async (
  req: Request<{}, {}, {}, { search: string; group: string }>,
  res: Response,
) => {
  if (req.query.group) {
    const tasks = await getAll(req.query.group)

    res.json({
      success: true,
      tasks,
    })

    return
  }

  if (req.query.search) {
    try {
      const query = req.query.search.split(" & ").reduce(
        (initial, current) => ({
          ...initial,
          [current.split(":")[0]]: current.split(":")[1],
        }),
        {},
      )

      const tasks = await searchOnMetadata(query)

      res.json({
        success: true,
        tasks,
      })

      return
    } catch (e) {}
  }

  const tasks = await getAll()

  res.json({
    success: true,
    tasks,
  })
}
