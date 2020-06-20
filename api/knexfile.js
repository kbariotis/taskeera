require("ts-node/register")

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "taskeera",
      user: "postgres",
      password: "mysecretpassword",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
}
