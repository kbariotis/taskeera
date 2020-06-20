import React from "react"
import { Menu, Header } from "semantic-ui-react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

import Search from "./components/Search"

import TaskPage from "./pages/task"
import GroupPage from "./pages/group"
import SearchPage from "./pages/search"
import IndexPage from "./pages/index"

function App() {
  const activeItem: string = "home"

  return (
    <Router>
      <Menu>
        <Menu.Item>
          <Header as="h1">
            <Link to="/">Taskeera</Link>
          </Header>
        </Menu.Item>
        <Menu.Item>
          <Search />
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
        <Route path="/group/:group">
          <GroupPage />
        </Route>
        <Route path="/search">
          <SearchPage />
        </Route>
        <Route path="/">
          <IndexPage />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
