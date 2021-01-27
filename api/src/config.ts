require("dotenv").config()

function getEnvVar(name: string, parser?: (input: string) => any) {
  const envVar = process.env[name]
  if (!envVar) {
    throw new Error(`${name} env var is not set`)
  }
  return parser ? parser(envVar) : envVar
}

type Config = {
  nodeEnv: string
  appMode: string
  postgres: {
    host: string
    password: string
    username: string
    db: string
  }
}

const config: Config = {
  nodeEnv: getEnvVar("NODE_ENV"),
  appMode: getEnvVar("APP_MODE"),
  postgres: {
    host: getEnvVar("POSTGRES_HOST"),
    password: getEnvVar("POSTGRES_PASSWORD"),
    username: getEnvVar("POSTGRES_USER"),
    db: getEnvVar("POSTGRES_DB"),
  },
}

export default config
