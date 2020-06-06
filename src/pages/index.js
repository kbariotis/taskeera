import React, { useState } from "react"
import { Row, Col } from "react-flexbox-grid"

import Layout from "../components/layouts/default"
import SDKImage from "../components/nodejs"
import ObserveImage from "../components/observe.svg"
import LogosImage from "../components/logos"
import SearchImage from "../components/search.svg"
import SEO from "../components/seo"

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

const verifyEmail = email => {
  return email.indexOf("@") > 0 && email.indexOf(" ") === -1
}

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

const SignUpForm = () => {
  const [email, setEmail] = useState()
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [validEmail, setValidEmail] = useState(true)

  const handleSubmit = async evt => {
    evt.preventDefault()

    if (!verifyEmail(email)) {
      setValidEmail(false)
      return
    }

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "subscribe",
          email: email,
        }),
      })
    } catch (e) {
      setError(true)
      return
    }

    setSuccess(true)
  }

  return (
    <>
      {!error && !success && (
        <form
          onSubmit={handleSubmit}
          name="subscribe"
          method="post"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="subscribe" />
          <Row center="xs">
            <Col xs={8}>
              <Row>
                <Col sm={8}>
                  <input
                    name="email"
                    onChange={e => {
                      setEmail(e.target.value)
                      setValidEmail(true)
                    }}
                    style={{
                      display: "block",
                      "border-radius": "5px",
                      border: "1px solid #ccc",
                      padding: "9px",
                      width: "100%",
                      "margin-top": "1rem",
                      "border-color": validEmail ? "#ccc" : "red",
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
                    Subscribe
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
      )}
      {error && (
        <span style={{ color: "red" }}>
          We couldn't submit the form. Try again in a bit.
        </span>
      )}
      {success && (
        <span style={{ color: "green" }}>
          Thank you. We will be in touch. :)
        </span>
      )}
    </>
  )
}

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
