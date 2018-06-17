import React from "react"
import { Link } from "gatsby"
import Layout from "../layouts"
import styled from "styled-components"

const ProjectPanel = styled.div`
  margin-bottom: 30px;
`

const Title = styled.h3`
  margin-bottom: 10px;
`
const ProjectDate = styled.h4`
  color: #bbb;
  font-size: 0.8em;
  line-height: 0.8em;
`
const Excerpt = styled.p`
`

class Index extends React.Component {
  render() {
    const projects = this.props.data.projects.edges

    return (
      <Layout location={this.props.location}>
        {projects.map(({ node }) =>
        <ProjectPanel key={node.id}>
          <Link
            to={node.fields.slug}
          >
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: 30 }}>
                <img src={node.frontmatter.images[0].childImageSharp.resize.src} alt="" />
              </div>
              <div>
                <Title>
                  {node.frontmatter.title}
                </Title>
                <ProjectDate color="#BBB">{node.frontmatter.startDate}</ProjectDate>
                <Excerpt>
                  {node.excerpt}
                </Excerpt>
              </div>
            </div>
          </Link>
        </ProjectPanel>
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
            startDate(formatString: "DD MMMM, YYYY")
            images {
              childImageSharp {
                resize(width: 400, height: 100, cropFocus: ENTROPY) {
                  src
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
  }
`