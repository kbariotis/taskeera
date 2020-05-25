import React from "react"
import { Row, Col } from "react-flexbox-grid"

import Layout from "../components/layout"
import SDKImage from "../components/nodejs"
import ObserveImage from "../components/observe.svg"
import SearchImage from "../components/search.svg"
import SEO from "../components/seo"

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

const SignUpForm = () => (
  <Row center="xs">
    <Col xs={8}>
      <Row>
        <Col sm={8}>
          <input
            style={{
              display: "block",
              "border-radius": "5px",
              border: "1px solid #ccc",
              padding: "9px",
              width: "100%",
              "margin-top": "1rem",
            }}
            placeholder="Your email to keep you in the loop"
            type="text"
          />
        </Col>
        <Col sm={4}>
          <button
            style={{
              "margin-top": "1rem",
              display: "block",
              width: "100%",
              background: "#CC7FF3",
              "border-radius": "5px",
              padding: "10px",
              border: "none",
              color: "white",
            }}
            type="submit"
          >
            Susbcribe
          </button>
        </Col>
      </Row>
    </Col>
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
            title={"Observe"}
            text={
              "Observe your tasks through Taskeeras' UI. Search for a specific group or aggregate based on tags."
            }
            orientation={"left"}
            image={<ObserveImage />}
          />
          <HowItWorksEntry
            title={"Search and Analyze"}
            text={
              "Use Taskeeras' UI to search through your tasks names, metadata and tags. Aggregate and analyze the results."
            }
            orientation={"right"}
            image={<SearchImage />}
          />
        </div>
      </Col>
    </Row>
    <SEO title="Home" />
  </Layout>
)

export default IndexPage
