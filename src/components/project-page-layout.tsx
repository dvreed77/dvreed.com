import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Link } from "gatsby"
import { Layout } from "./Layout"
import Img from "gatsby-image"

const shortcodes = { Link } // Provide common components here

export default function PageTemplate({ data: { mdx } }) {
  console.log(mdx)

  // let featuredImgFluid = mdx.frontmatter.featuredImage.childImageSharp.fluid

  return (
    <Layout>
      <div>
        <h1 className="text-5xl font-bold">{mdx.frontmatter.title}</h1>
        <div className="font-thin text-sm">
          Created from {mdx.frontmatter.startDate} to {mdx.frontmatter.endDate}
        </div>

        <ul>
          <li>
            <span>Repository:</span>
            <a href={mdx.frontmatter.repoURL}>Link</a>
          </li>
          <li>
            <span>Project:</span>
            <a href={mdx.frontmatter.projectURL}>Link</a>
          </li>
        </ul>

        <Img fluid={mdx.frontmatter.images[0].childImageSharp.fluid} />

        <div className="mdx">
          <MDXProvider components={shortcodes}>
            <MDXRenderer>{mdx.body}</MDXRenderer>
          </MDXProvider>
        </div>
      </div>
    </Layout>
  )
}
export const pageQuery = graphql`
  query ProjectQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        startDate(formatString: "MMMM YYYY")
        endDate(formatString: "MMMM YYYY")
        repoURL
        projectURL

        images {
          publicURL
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
