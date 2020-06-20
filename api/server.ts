import app from "./src/app"
import { factory } from "./src/sockets"

const PORT = process.env.PORT || 8080

const server = factory(app)

server.listen(PORT, function () {
  console.log(`Webserver is ready and listening on port ${PORT}`)
})

process.on("SIGINT", function onSigint() {
  console.info(
    "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
    new Date().toISOString(),
  )
  shutdown()
})

process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM (docker container stop). Graceful shutdown ",
    new Date().toISOString(),
  )
  shutdown()
})

let sockets = {},
  nextSocketId = 0
server.on("connection", function (socket) {
  const socketId = nextSocketId++
  sockets[socketId] = socket

  socket.once("close", function () {
    delete sockets[socketId]
  })
})

// shut down server
function shutdown() {
  waitForSocketsToClose(10)

  server.close(function onServerClosed(err) {
    if (err) {
      console.error(err)
      process.exitCode = 1
    }
    process.exit()
  })
}

function waitForSocketsToClose(counter: number) {
  if (counter > 0) {
    console.log(
      `Waiting ${counter} more ${
        counter !== 1 ? "seconds" : "second"
      } for all connections to close...`,
    )
    return setTimeout(waitForSocketsToClose, 1000, counter - 1)
  }

  console.log("Forcing all connections to close now")
  for (var socketId in sockets) {
    sockets[socketId].destroy()
  }

  return
}
