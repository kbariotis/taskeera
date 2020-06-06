const path = require("path")

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  /**
   * Fetch our posts
   */
  return graphql(`
    {
      docs: allMarkdownRemark(limit: 1000, filter: { frontmatter: {} }) {
        edges {
          next {
            frontmatter {
              path
            }
          }
          node {
            html
            id
            timeToRead
            frontmatter {
              path
              tags
              title
            }
          }
        }
      }
    }
  `).then(results => {
    if (results.errors) {
      return Promise.reject(results.errors)
    }

    const docs = results.data.docs.edges

    const docsTemplate = path.resolve(`src/templates/docs.js`)

    /**
     * Create pages for each markdown file.
     */
    docs.forEach(({ node, next }) => {
      console.log(node.frontmatter.path)
      createPage({
        path: node.frontmatter.path,
        component: docsTemplate,
        context: {
          mainPostPath: node.frontmatter.path,
          nextPostPath: next ? next.frontmatter.path : "none",
        },
      })
    })
  })
}
