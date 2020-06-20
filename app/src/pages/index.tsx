import React from "react"
import { Divider, Container, Header, Statistic } from "semantic-ui-react"
import { Link } from "react-router-dom"

import { useSocket } from "../hooks/useSocket"
import {
  useAggregateApi,
  APPEND_RECORD_COUNT,
  ADD_RECORD,
} from "../hooks/useAggregateApi"

function IndexPage() {
  const [{ records, isLoading, isError }, dispatch] = useAggregateApi()

  useSocket(message => {
    switch (message.event) {
      case "TASK_CREATED":
      case "TASK_UPDATED": {
        const existingRecord = records.find(
          item =>
            item.group === message.data.group &&
            item.state === message.data.state,
        )

        if (existingRecord) {
          dispatch({
            type: APPEND_RECORD_COUNT,
            payload: {
              group: message.data.group,
              state: message.data.state,
              count: Number(existingRecord.count) + 1,
            },
          })
        } else {
          dispatch({
            type: ADD_RECORD,
            payload: {
              group: message.data.group,
              state: message.data.state,
              count: 1,
            },
          })
        }
        break
      }
      default:
        break
    }
  })

  const stats = records?.reduce<
    Record<string, { state: string; count: number }[]>
  >((initial, current) => {
    if (!initial[current.group]) {
      initial[current.group] = []
    }
    initial[current.group].push({
      state: current.state,
      count: current.count,
    })

    return initial
  }, {})

  return (
    <Container text>
      <Header as="h2">Groups</Header>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        stats &&
        Object.keys(stats).map((item, index) => (
          <div key={index}>
            <b>{item}</b>{" "}
            <small>
              (<Link to={`/group/${item}`}>See more</Link> )
            </small>
            <Statistic.Group widths="four" key={index} size="tiny">
              {stats[item].map((item, index) => (
                <Statistic key={index}>
                  <Statistic.Value>{item.count}</Statistic.Value>
                  <Statistic.Label>{item.state}</Statistic.Label>
                </Statistic>
              ))}
            </Statistic.Group>
            <Divider />
          </div>
        ))
      )}
    </Container>
  )
}

export default IndexPage
