import axios from "axios"
import { useEffect, useReducer } from "react"

export type Record = {
  group: string
  state: string
  count: number
}

type TaskApiState = {
  records: Record[]
  isLoading: boolean
  isError: boolean
}

export const ADD_RECORD = "ADD_RECORD"
export const FETCH_SUCCESS = "FETCH_SUCCESS"
export const APPEND_RECORD_COUNT = "APPEND_RECORD_COUNT"
export const FETCH_INIT = "FETCH_INIT"
export const FETCH_FAILURE = "FETCH_FAILURE"

interface ADD_RECORD_ACTION_TYPE {
  type: typeof ADD_RECORD
  payload: Record
}
interface FETCH_SUCCESS_ACTION_TYPE {
  type: typeof FETCH_SUCCESS
  payload: Record[]
}
interface APPEND_RECORD_COUNT_ACTION_TYPE {
  type: typeof APPEND_RECORD_COUNT
  payload: Record
}
interface FETCH_INIT_ACTION_TYPE {
  type: typeof FETCH_INIT
}
interface FETCH_FAILURE_ACTION_TYPE {
  type: typeof FETCH_FAILURE
}

type ACTION_TYPE =
  | ADD_RECORD_ACTION_TYPE
  | FETCH_SUCCESS_ACTION_TYPE
  | APPEND_RECORD_COUNT_ACTION_TYPE
  | FETCH_INIT_ACTION_TYPE
  | FETCH_FAILURE_ACTION_TYPE

const dataFetchReducer = (state: TaskApiState, action: ACTION_TYPE) => {
  switch (action.type) {
    case FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case FETCH_SUCCESS:
      return {
        isLoading: false,
        isError: false,
        records: action.payload,
      }
    case ADD_RECORD:
      return {
        isLoading: false,
        isError: false,
        records: [...state.records, action.payload],
      }
    case APPEND_RECORD_COUNT:
      return {
        isLoading: false,
        isError: false,
        records: state.records.reduce((initial: Record[], current) => {
          if (
            current.group === action.payload.group &&
            current.state === action.payload.state
          ) {
            return [...initial, action.payload]
          }

          return [...initial, current]
        }, []),
      }
    case FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    default:
      throw new Error()
  }
}

export const useAggregateApi = (): [
  TaskApiState,
  React.Dispatch<ACTION_TYPE>,
] => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    records: [],
    isLoading: true,
    isError: false,
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      const result = await axios(`/api/tasks/aggregate`)
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

  return [state, dispatch]
}
