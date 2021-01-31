import { run } from "graphile-worker"

import config from "./config"
import logger from "./logger"
import processTaskWorker from "./workers/processTask"

async function main() {
  const runner = await run({
    connectionString: `postgres://${config.postgres.username}:${config.postgres.password}@${config.postgres.host}:5432/${config.postgres.db}`,
    concurrency: 2,
    noHandleSignals: true,
    pollInterval: 1000,
    taskList: {
      processTask: processTaskWorker,
    },
  })

  await runner.promise
}

main().catch(err => {
  logger.error(err)
  process.exit(1)
})
