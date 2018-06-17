import React from "react";
import Gallery from '../components/Gallery'
import Helmet from 'react-helmet';
import Img from "gatsby-image";

export default ({ data }) => (
  <div>
    <Helmet title={"Paintings"}/>
    <Gallery
      images={data.allMarkdownRemark.edges.map(({ node }) => ({
        caption: `${node.frontmatter.title} - ${node.frontmatter.date}`,
        thumb: node.frontmatter.image.childImageSharp.resize.src,
        resolutions: node.frontmatter.image.childImageSharp.resolutions,
        sizes: node.frontmatter.image.childImageSharp.sizes,
        src: node.frontmatter.image.childImageSharp.original.src
      }))}
    />

    {/* {data.allMarkdownRemark.edges.map(({ node }) =>
      <div key={node.id}>
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: 30 }}>
            <Img resolutions={node.frontmatter.image.childImageSharp.resolutions} alt="" />
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
    )} */}
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
                original {
                  src
                }
                resize(width: 400, cropFocus: CENTER) {
                  src
                }
                resolutions(width: 300) {
                  ...GatsbyImageSharpResolutions
                }
                sizes(maxWidth: 600) {
                  ...GatsbyImageSharpSizes_noBase64
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