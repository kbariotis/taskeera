import React from "react"
import {
  SemanticCOLORS,
  Label,
  Container,
  Header,
  Table,
} from "semantic-ui-react"

import { Link } from "react-router-dom"

import "semantic-ui-css/semantic.min.css"

import { useTasksApi } from "../hooks/useTasksApi"

const options: Record<string, SemanticCOLORS> = {
  waiting: "teal",
  queued: "yellow",
  delayed: "purple",
  running: "blue",
  failed: "red",
  done: "olive",
}
function IndexPage() {
  const [{ tasks, isLoading, isError }, setSearchQuery] = useTasksApi("", [])

  return (
    <Container text>
      <Header as="h2">Tasks</Header>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <Table celled>
          <Table.Header>
            <Table.Row
              style={{
                marginTop: "100px",
              }}
            >
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
              <Table.HeaderCell>Group</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {tasks.map((item, index: number) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Link to={`/task/${item.id}`}>{item.id}</Link>
                </Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>
                  <Label color={options[item.state]}>{item.state}</Label>
                </Table.Cell>
                <Table.Cell>{item.group}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export default IndexPage
