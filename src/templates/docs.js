import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"
import { Grid, Row, Col } from "react-flexbox-grid"

import Layout from "../components/layouts/docs"

const Docs = ({ data }) => {
  console.log(data)
  return (
    <Layout>
      <Grid>
        <Row>
          <Col md={3}>Nav</Col>
          <Col md={9}>
            <div
              dangerouslySetInnerHTML={{ __html: data.mainDocPost.html }}
            ></div>
          </Col>
        </Row>
      </Grid>
    </Layout>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Docs

export const docsQuery = graphql`
  query DocPostByPath($mainPostPath: String!, $nextPostPath: String!) {
    site {
      siteMetadata {
        title
      }
    }
    mainDocPost: markdownRemark(frontmatter: { path: { eq: $mainPostPath } }) {
      html
      excerpt
      frontmatter {
        path
        tags
        title
      }
    }
    nextDocPost: markdownRemark(frontmatter: { path: { eq: $nextPostPath } }) {
      html
      excerpt
      frontmatter {
        path
        tags
        title
      }
    }
  }
`
