import React from "react";
import Gallery from '../components/Gallery'
import Helmet from 'react-helmet';
import Img from "gatsby-image";
import Layout from "../layouts"
import styled from "styled-components"

const GalleryDiv = styled.div`
  column-count: 1;
  column-gap: 0;
  max-width: 1360px;
  margin: 0 auto;
  
  @media screen and (min-width: 400px) {
    column-count: 2;
  }
  
  @media screen and (min-width: 800px) {
    column-count: 3;
  }
  
  @media screen and (min-width: 1400px) {
    column-count: 4;
  }
`

const Image = styled.div`
  border: 4px solid transparent;
  break-inside: avoid;
  position: relative;

  @media screen and (min-width: 400px) {
    border-width: 1px;
  }

  @media screen and (min-width: 800px) {
    border-width: 1px;
  }
  @media screen and (min-width: 1000px) {
    border-width: 2px;
  }

  & img {
    border-radius: 2px;
  }

  & .gatsby-image-wrapper:hover {
    & div + img {
      opacity: 1 !important;
    }
    & img + img {
      opacity: 0 !important;
    }
    & span {
      opacity: 1 !important;
    }
  }
`

export default ({ data, location }) => {
  console.log('PPP', data)

  const paintings = data.allMarkdownRemark.edges
  return (
    <Layout location={location}>
      <Helmet title={"Paintings"}/>
      <Gallery
        images={paintings.map(({ node }) => ({
          caption: `${node.frontmatter.title} - ${node.frontmatter.date}`,
          fluid: node.frontmatter.image.childImageSharp.fluid,
          src: node.frontmatter.image.childImageSharp.original.src
        }))}
      />

      {/* <GalleryDiv>
        {paintings.map((image, index) => (
          <Image key={index}>
            <Img fluid={image.node.frontmatter.image.childImageSharp.fluid} />
          </Image>
        ))}
      </GalleryDiv> */}

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
    </Layout>
  )
}

export const query = graphql`
  query PaintingQuery {
    allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/paintings/"}}, 
      sort: {fields: [frontmatter___date], order: DESC}
    ) {
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
                fluid(
                  maxWidth: 500
                  quality: 80
                  cropFocus: CENTER
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
  }
`