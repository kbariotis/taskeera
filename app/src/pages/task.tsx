import React from "react"
import {
  SemanticCOLORS,
  Label,
  Container,
  Header,
  Table,
} from "semantic-ui-react"

import { useParams } from "react-router-dom"

import { useTaskApi, Task } from "../hooks/useTaskApi"

const options: Record<string, SemanticCOLORS> = {
  queued: "yellow",
  running: "blue",
  failed: "red",
  done: "olive",
}
function IndexPage() {
  const { id } = useParams()
  const [{ task, isLoading, isError }] = useTaskApi(id)

  return (
    <Container text>
      <Header as="h2">Task: {id}</Header>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <Table definition>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>Id</Table.Cell>
              <Table.Cell>{(task as Task).id}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>{(task as Task).name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Group</Table.Cell>
              <Table.Cell>{(task as Task).group}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Reference ID</Table.Cell>
              <Table.Cell>{(task as Task).reference_id}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>State</Table.Cell>
              <Table.Cell>
                <Label color={options[(task as Task).state]}>
                  {(task as Task).state}
                </Label>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Created</Table.Cell>
              <Table.Cell>{(task as Task).created_at}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Metadata</Table.Cell>
              <Table.Cell>{JSON.stringify((task as Task).metadata)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export default IndexPage
