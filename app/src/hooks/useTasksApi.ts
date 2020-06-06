import axios from "axios"
import { useEffect, useReducer } from "react"

type Task = {
  id: number
  name: string
}

type TasksApiState = {
  tasks: Task[]
  isLoading: boolean
  isError: boolean
}

const dataFetchReducer = (
  state: TasksApiState,
  action: { type: string; payload?: Task[] },
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
        tasks: [...state.tasks, ...(action.payload as Task[])],
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

export const useTasksApi = (initialData: Task[]) => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    tasks: initialData,
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      const result = await axios("/tasks")
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
  }, [])

  return [state]
}
