import { createServer, Server } from "http"
import WebSocket from "ws"

import logger from "./logger"

type TaskCreatedEvent = {
  event: "TASK_CREATED"
  data: Record<string, any>
}

type TaskUpdatedEvent = {
  event: "TASK_UPDATED"
  data: Record<string, any>
}

let socketsServer: WebSocket.Server

let sockets = {}
let nextSocketId = 0

const factory = (app: any): Server => {
  const server = createServer(app)
  socketsServer = new WebSocket.Server({ server })
  socketsServer.on("connection", (ws: WebSocket) => {
    ws.on("message", function (message: WebSocket.MessageEvent) {
      logger.info("Received message", message)
    })
  })
  socketsServer.on("error", err =>
    logger.error("Error from the WS server", err),
  )

  server.on("connection", function (socket) {
    const socketId = nextSocketId++
    sockets[socketId] = socket

    socket.once("close", function () {
      delete sockets[socketId]
    })
  })

  return server
}

function closeServer(counter: number) {
  if (counter > 0) {
    console.log(
      `Waiting ${counter} more ${
        counter !== 1 ? "seconds" : "second"
      } for all connections to close...`,
    )
    return setTimeout(closeServer, 1000, counter - 1)
  }

  console.log("Forcing all connections to close now")
  for (var socketId in sockets) {
    sockets[socketId].destroy()
  }

  return
}

function broadcast(event: TaskUpdatedEvent | TaskCreatedEvent) {
  socketsServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event))
    }
  })
}

export { factory, broadcast, closeServer }
