import React from "react"
import { Container, Header, Table } from "semantic-ui-react"

import "semantic-ui-css/semantic.min.css"

import { useTasksApi } from "./hooks/useTasksApi"

function App() {
  const [{ tasks, isLoading, isError }] = useTasksApi([])

  return (
    <Container text>
      <Header as="h1">Taskeera</Header>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {tasks.map((item: any) => (
              <Table.Row>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.state}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export default App
