import React from "react"
import { Menu, Input, Container, Header, Table } from "semantic-ui-react"

import "semantic-ui-css/semantic.min.css"

import { useTasksApi } from "./hooks/useTasksApi"

function App() {
  const [{ tasks, isLoading, isError }, setSearchQuery] = useTasksApi("", [])

  const activeItem: string = "account"
  return (
    <>
      <Menu>
        <Menu.Item>
          <Header as="h1">Taskeera</Header>
        </Menu.Item>
        <Menu.Item>
          <Input
            icon="search"
            placeholder="Search..."
            onKeyPress={(event: any) =>
              event.key === "Enter"
                ? setSearchQuery(event.target.value)
                : undefined
            }
          />
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item
            name="account"
            active={activeItem === "home"}
            onClick={() => {}}
          />
        </Menu.Menu>
      </Menu>
      <Container text>
        <Header as="h2">Tasks</Header>
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
                <Table.HeaderCell>Group</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {tasks.map((item: any, index: number) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.state}</Table.Cell>
                  <Table.Cell>{item.group}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Container>
    </>
  )
}

export default App
