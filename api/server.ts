import app from "./src/app"
import logger from "./src/logger"
import { factory, closeServer } from "./src/sockets"

const PORT = process.env.PORT || 8080

const server = factory(app)

server.listen(PORT, function () {
  logger.info(`Webserver is ready and listening on port ${PORT}`)
})

process.on("SIGINT", function onSigint() {
  logger.info(
    "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
    new Date().toISOString(),
  )
  shutdown()
})

process.on("SIGTERM", function onSigterm() {
  logger.info(
    "Got SIGTERM (docker container stop). Graceful shutdown ",
    new Date().toISOString(),
  )
  shutdown()
})

function shutdown() {
  closeServer(10)

  server.close(function onServerClosed(err) {
    if (err) {
      logger.error(err)
      process.exit(1)
    } else {
      process.exit()
    }
  })
}
