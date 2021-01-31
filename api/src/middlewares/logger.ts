import Boom from "@hapi/boom"
import { Request, Response, NextFunction } from "express"

import logger from "../logger"

const loggerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  logger.error(err)

  if (req.app.get("env") !== "development" && req.app.get("env") !== "test") {
    delete err.stack
  }

  if (Boom.isBoom(err)) {
    res.status(err.output.statusCode).json({
      success: false,
      message: err.message,
      error: err.data,
    })
    return
  }

  res.status(500).json({
    success: false,
  })
}

export default loggerMiddleware
