import React, { useState } from "react"
import { useRecoilState } from "recoil"
import { Input } from "semantic-ui-react"
import { useHistory } from "react-router-dom"

import SearchState from "../state/search"

function App() {
  const [_, setSearchState] = useRecoilState(SearchState)
  const [search, setSearch] = useState("")
  const history = useHistory()

  return (
    <Input
      icon="search"
      placeholder="Search..."
      value={search}
      onChange={(event: any) => {
        setSearch(event.target.value)
      }}
      onKeyPress={(event: any) => {
        if (event.key === "Enter") {
          setSearchState(event.target.value)
          history.push("/search")
        }
      }}
    />
  )
}

export default App
