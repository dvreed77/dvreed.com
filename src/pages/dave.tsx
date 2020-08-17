import React from "react"
import { graphql } from "gatsby"

export default function Dave({ data }) {
  console.log(data)
  return <div>Dave</div>
}

export const pageQuery = graphql`
  query {
    allMdx(filter: { fields: { collection: { eq: "posts" } } }) {
      edges {
        node {
          fields {
            collection
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
