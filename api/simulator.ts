import axios from "axios"
import bluebird from "bluebird"

const services = ["user-service", "payment-service", "schedule-service"]
const states = ["done", "running", "waiting", "failed"]
const tasks = {
  "user-service": ["onboard-user", "offboard-user"],
  "payment-service": ["process-payment", "process-refund"],
  "schedule-service": ["set-event", "cancel-event"],
}

const randomNo = (min: number, max: number) =>
  Math.floor(Math.random() * max) + min
const randomService = () => services[randomNo(0, services.length)]
const service = randomService()
const randomState = () => states[randomNo(0, states.length)]
const randomTask = () => tasks[service][randomNo(0, tasks[service].length)]

async function main() {
  for (let index = 0; index < 1000; index++) {
    console.log("*")
    await axios({
      method: "post",
      url: "http://localhost:8090/tasks",
      data: {
        state: randomState(),
        name: randomTask(),
        group: service,
        metadata: {
          userId: randomNo(1, 5000),
        },
      },
    })
    await bluebird.delay(1000)
  }
}

main()
