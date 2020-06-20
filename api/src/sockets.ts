import { createServer, Server } from "http"
import WebSocket from "ws"

import logger from "./logger"

const onConnection = (ws: WebSocket) => {
  ws.on("message", function (message: WebSocket.MessageEvent) {
    logger.info("Received message", message)
  })
}

let sockets: WebSocket.Server

const factory = (app: any): Server => {
  const server = createServer(app)
  sockets = new WebSocket.Server({ server })
  sockets.on("connection", onConnection)
  sockets.on("error", err => logger.error("Error from the WS server", err))

  return server
}

export { factory, sockets }
