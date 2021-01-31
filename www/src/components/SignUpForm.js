import React, { useState } from "react"
import { Row, Col } from "react-flexbox-grid"

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

const verifyEmail = email => {
  return email.indexOf("@") > 0 && email.indexOf(" ") === -1
}

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

export default SignUpForm
