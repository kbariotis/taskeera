import axios from "axios"
import { useEffect, useReducer } from "react"

export type Task = {
  id: number
  name: string
  state: "waiting" | "queued" | "delayed" | "running" | "failed" | "done"
  group: string
  metadata: Record<string, any>
}

type TaskApiState = {
  task?: Task
  isLoading: boolean
  isError: boolean
}

const dataFetchReducer = (
  state: TaskApiState,
  action: { type: string; payload?: Task },
) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case "FETCH_SUCCESS":
      return {
        isLoading: false,
        isError: false,
        task: action.payload as Task,
      }
    case "TASK_UPDATED":
      return {
        isLoading: false,
        isError: false,
        task: action.payload as Task,
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    default:
      throw new Error()
  }
}

export const useTaskApi = (taskId: number): [TaskApiState] => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: true,
    isError: false,
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      const result = await axios(`/api/tasks/${taskId}`)
      try {
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data.task })
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" })
        }
      }
    }

    fetchData()

    return () => {
      didCancel = true
    }
  }, [taskId])

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8090/socket-io")

    socket.addEventListener("message", function (event) {
      const payload = JSON.parse(event.data)
      switch (payload.event) {
        case "TASK_UPDATED":
          if (payload.data.id === taskId) {
            dispatch({
              type: "TASK_UPDATED",
              payload: payload.data,
            })
          }
          break
        default:
          break
      }
    })
  }, [])

  return [state]
}
