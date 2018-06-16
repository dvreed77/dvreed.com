import React from "react";

export default ({ data }) => (
  <div>
    <h1>All My Paintings</h1>
    {data.allMarkdownRemark.edges.map(({ node }) =>
      <div key={node.id}>
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: 30 }}>
            <img src={node.frontmatter.image.childImageSharp.resize.src} alt="" />
          </div>
          <div>
            <div>
              {node.frontmatter.title}
            </div>
            <div color="#BBB">{node.frontmatter.date}</div>
            <div>
              {node.excerpt}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

export const query = graphql`
  query PaintingQuery {
    allMarkdownRemark(filter: {id: {regex: "/paintings/"}}, sort: {fields: [frontmatter___date], order: DESC}) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM YYYY")
            image {
              childImageSharp {
                resize(width: 100, height: 100, cropFocus: ENTROPY) {
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