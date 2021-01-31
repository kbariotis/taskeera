import React from "react"
import { Row, Col } from "react-flexbox-grid"

import Layout from "../components/layouts/default"
import SDKImage from "../components/nodejs"
import ObserveImage from "../components/observe.svg"
import LogosImage from "../components/logos"
import SearchImage from "../components/search.svg"
import SEO from "../components/seo"
import SignUpForm from "../components/SignUpForm"

const HowItWorksEntry = ({ title, text, image, orientation }) => (
  <Row
    style={{
      "margin-bottom": "3rem",
    }}
    middle="xs"
  >
    {orientation === "left" && <Col sm>{image}</Col>}
    <Col
      sm
      style={{
        "text-align": "left",
      }}
    >
      <h3
        style={{
          "font-weight": "400",
        }}
      >
        {title}
      </h3>
      <p>{text}</p>
    </Col>
    {orientation === "right" && <Col sm>{image}</Col>}
  </Row>
)

const IndexPage = () => (
  <Layout>
    <Row center="xs">
      <Col md={8}>
        <div
          style={{
            "margin-top": "10rem",
          }}
        >
          <h1
            style={{
              "font-weight": "bold",
              "font-size": "3rem",
            }}
          >
            Taskeera
          </h1>
          <p style={{ "font-size": "1.2rem" }}>
            Bring visibility of your background tasks.
          </p>
          <SignUpForm />
        </div>
        <div
          style={{
            "margin-top": "5rem",
          }}
        >
          <h2>How it works</h2>
          <HowItWorksEntry
            title={"Register your jobs"}
            text={
              "Taskeera works with all asynchronous systems. Use a powerful API to register your tasks. Assign tags and make them easily accesible and searchable. We provide SDKs for the most popular languages."
            }
            orientation={"right"}
            image={<SDKImage />}
          />
          <HowItWorksEntry
            title={"Integrate"}
            text={
              "Integrate with ease with your favorite message broker or distributed queue of choice. We provide plugins for all the major platforms."
            }
            orientation={"left"}
            image={<LogosImage />}
          />
          <HowItWorksEntry
            title={"Observe"}
            text={
              "Observe your tasks through Taskeeras' UI. Search for a specific group or aggregate based on tags."
            }
            orientation={"right"}
            image={<ObserveImage />}
          />
          <HowItWorksEntry
            title={"Search and Analyze"}
            text={
              "Use Taskeeras' UI to search through your tasks names, metadata and tags. Aggregate and analyze the results."
            }
            orientation={"left"}
            image={<SearchImage />}
          />
        </div>
      </Col>
    </Row>
    <SEO title="Home" />
  </Layout>
)

export default IndexPage
