import axios from "axios"
import { useState, useEffect, useReducer } from "react"

type Task = {
  id: number
  name: string
  state: string
  group: string
}

type TasksApiState = {
  tasks: Task[]
  isLoading: boolean
  isError: boolean
}

const dataFetchReducer = (
  state: TasksApiState,
  action: { type: string; payload?: Task[] | Task },
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
        tasks: action.payload as Task[],
      }
    case "NEW_TASK_RECEIVED":
      return {
        isLoading: false,
        isError: false,
        tasks: [(action.payload as unknown) as Task, ...state.tasks],
      }
    case "TASK_UPDATED":
      return {
        isLoading: false,
        isError: false,
        tasks: state.tasks.map(item =>
          item.id === ((action.payload as unknown) as Task).id
            ? ((action.payload as unknown) as Task)
            : item,
        ),
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

export const useTasksApi = (
  initialSearchQuery: string,
  initialData: Task[],
): [TasksApiState, React.Dispatch<React.SetStateAction<string>>] => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    tasks: initialData,
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      const result = await axios(
        `/api/tasks?${searchQuery ? `search=${searchQuery}` : ""}`,
      )
      try {
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data.tasks })
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
  }, [searchQuery])

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8090/socket-io")

    socket.addEventListener("message", function (event) {
      const payload = JSON.parse(event.data)
      switch (payload.event) {
        case "TASK_CREATED":
          dispatch({
            type: "NEW_TASK_RECEIVED",
            payload: JSON.parse(event.data).data,
          })
          break
        case "TASK_UPDATED":
          dispatch({
            type: "TASK_UPDATED",
            payload: JSON.parse(event.data).data,
          })
          break
        default:
          break
      }
    })
  }, [])

  return [state, setSearchQuery]
}
