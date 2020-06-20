import { useRef, useEffect } from "react"

export type Task = {
  id: number
  name: string
  state: "waiting" | "queued" | "delayed" | "running" | "failed" | "done"
  group: string
  metadata: Record<string, any>
  created_at: string
}

export type Payload = {
  event: "TASK_CREATED" | "TASK_UPDATED"
  data: Task
}

export const useSocket = (callback: (data: Payload) => void): void => {
  const socket = useRef({})

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8090/socket-io")

    return () => {
      ;(socket.current as WebSocket).close()
    }
  }, [])

  useEffect(() => {
    if (socket) {
      ;(socket.current as WebSocket).onmessage = event => {
        const payload = JSON.parse(event.data)

        callback(payload)
      }
    }
  })

  return
}
