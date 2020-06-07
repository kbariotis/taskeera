import React from "react"
import {
  SemanticCOLORS,
  Label,
  Container,
  Header,
  Table,
} from "semantic-ui-react"

import { useParams } from "react-router-dom"

import "semantic-ui-css/semantic.min.css"

import { useTaskApi, Task } from "../hooks/useTaskApi"

const options: Record<string, SemanticCOLORS> = {
  waiting: "teal",
  queued: "yellow",
  delayed: "purple",
  running: "blue",
  failed: "red",
  done: "olive",
}
function IndexPage() {
  const { id } = useParams()
  const [{ task, isLoading, isError }] = useTaskApi(id)

  console.log(task, isLoading)
  return (
    <Container text>
      <Header as="h2">Task: {id}</Header>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? <div>Loading ...</div> : (task as Task).id}
    </Container>
  )
}

export default IndexPage
