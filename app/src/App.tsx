import React from "react"
import { Menu, Input, Header } from "semantic-ui-react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

import TaskPage from "./pages/task"
import IndexPage from "./pages/index"

function App() {
  const activeItem: string = "home"
  return (
    <Router>
      <div>
        <Menu>
          <Menu.Item>
            <Header as="h1">
              <Link to="/">Taskeera</Link>
            </Header>
          </Menu.Item>
          <Menu.Item>
            <Input
              icon="search"
              placeholder="Search..."
              // onKeyPress={(event: any) =>
              //   event.key === "Enter"
              //     ? setSearchQuery(event.target.value)
              //     : undefined
              // }
            />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item
              name="account"
              active={activeItem === "home"}
              onClick={() => <Link to="/" />}
            />
          </Menu.Menu>
        </Menu>

        <Switch>
          <Route path="/task/:id">
            <TaskPage />
          </Route>
          <Route path="/">
            <IndexPage />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
