import winston from "winston"

export default winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: {},
  transports: [new winston.transports.Console()],
})
