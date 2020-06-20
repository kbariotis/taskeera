import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"

import { createTask } from "./controllers/tasks/create"
import { updateTask } from "./controllers/tasks/update"
import { getAllTasks } from "./controllers/tasks/getAll"
import { getOneTask } from "./controllers/tasks/getOne"
import { aggregateTasks } from "./controllers/tasks/aggregate"
import loggerMiddleware from "./middlewareds/logger"

import "./workers/tasks"

const app = express()
app.use(bodyParser.json())
app.use(morgan("combined"))

app.get("/tasks", getAllTasks)
app.get("/tasks/aggregate", aggregateTasks)
app.get("/tasks/:id", getOneTask)
app.post("/tasks", createTask)
app.put("/tasks/:id", updateTask)

app.use(loggerMiddleware)

export default app
