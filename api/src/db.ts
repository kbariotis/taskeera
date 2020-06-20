import knex from "knex"

import config from "./config"

export default knex({
  client: "pg",
  version: "7.2",
  connection: {
    host: config.postgres.host,
    user: config.postgres.username,
    password: config.postgres.password,
    database: config.postgres.db,
  },
  asyncStackTraces: config.appMode === "development",
  migrations: {
    tableName: "knex_migrations",
  },
})
