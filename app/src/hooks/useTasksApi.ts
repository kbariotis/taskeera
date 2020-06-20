import axios from "axios"
import { useEffect, useReducer } from "react"

import { useSocket } from "./useSocket"

export type Task = {
  id: number
  name: string
  state: "waiting" | "queued" | "delayed" | "running" | "failed" | "done"
  group: string
  metadata: Record<string, any>
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
  initialData: Task[],
  query: {
    search?: string
    group?: string
  },
): [TasksApiState] => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: true,
    isError: false,
    tasks: initialData,
  })

  const { search, group } = query

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      const result = await axios(
        `/api/tasks${query.search ? `?search=${query.search}` : ""}${
          query.group ? `?group=${query.group}` : ""
        }`,
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
  }, [search, group])

  useSocket(payload => {
    if (payload.data.group !== group) {
      return
    }
    switch (payload.event) {
      case "TASK_CREATED":
        dispatch({
          type: "NEW_TASK_RECEIVED",
          payload: payload.data,
        })
        break
      case "TASK_UPDATED":
        dispatch({
          type: "TASK_UPDATED",
          payload: payload.data,
        })
        break
      default:
        break
    }
  })

  return [state]
}
