import React from "react"
import { Link } from "gatsby"
import Layout from "../layouts"
import styled from "styled-components"
import Img from "gatsby-image";

const ProjectPanel = styled.div`
  margin-bottom: 30px;

  display: flex;
  flex-direction: row;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`

const Title = styled.h3`
  margin-bottom: 10px;
`
const ProjectDate = styled.h4`
  color: #bbb;
  font-size: 0.8em;
  line-height: 0.8em;
`

const StyledImg = styled.div`
  display: block;
  width: 100%;
  border: solid 1px #eee;
  margin-right: 20px;
  @media (max-width: 600px) {
    width: 100%;
    margin-bottom: 10px;
  }
`
const Excerpt = styled.p`
`

class Index extends React.Component {
  render() {

    const {blogs: {edges: blogs}, projects: {edges: projects}} = this.props.data


    return (
      <Layout location={this.props.location}>
        {projects.map(({ node }) =>
          <Link
            to={node.fields.slug}
            key={node.id}
          >
            <ProjectPanel >
              <StyledImg>
                <Img
                  fluid={node.frontmatter.images[0].childImageSharp.fluid}
                />
              </StyledImg>

              <div>
                <Title>
                  {node.frontmatter.title}
                </Title>
                <ProjectDate color="#BBB">{node.frontmatter.startDate}</ProjectDate>
                <Excerpt>
                  {node.excerpt}
                </Excerpt>
              </div>

            </ProjectPanel>
          </Link>
        )}

        {blogs.map(({ node }) =>
          <Link
            to={node.fields.slug}
            key={node.id}
          >
            <div>
              <h3>Blogs</h3>
              {node.fields.date} - {node.frontmatter.title}
            </div>
          </Link>
        )}
      </Layout>
    )
  }
}

export default Index

export const pageQuery = graphql`
  query IndexQuery2 {
    projects: allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/projects/"}}
      sort: { fields: [frontmatter___startDate], order: DESC }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            startDate(formatString: "MMMM YYYY")
            images {
              childImageSharp {
                fluid(
                  maxWidth: 500
                  maxHeight: 200
                  quality: 80
                  traceSVG: { background: "#EDEEF0", color: "#FCCB0A" }
                ) {
                  ...GatsbyImageSharpFluid_tracedSVG
                }
              }
            }
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
    blogs: allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/blog/"}}
      sort: { fields: [fields___date], order: DESC }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title            
          }
          fields {
            slug
            date(formatString: "DD MMMM YYYY")
          }
          excerpt
        }
      }
    }
  }
`