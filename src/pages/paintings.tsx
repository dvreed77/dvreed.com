import React from "react";
import { graphql } from "gatsby";
import { Layout } from "../components/Layout";
import Img from "gatsby-image";
import { SRLWrapper } from "simple-react-lightbox";

export default ({ data: { allPaintings } }) => {
  const { edges: paintings } = allPaintings;
  return (
    <Layout>
      <SRLWrapper>
        <div className="flex flex-row flex-wrap">
          {paintings.map((painting) => (
            <Img
              className="m-1 cursor-pointer"
              key={painting.node.id}
              // fluid={painting.node.frontmatter.image.childImageSharp.fluid}
              fixed={painting.node.frontmatter.image.childImageSharp.fixed}
              alt={painting.node.excerpt}
            />
          ))}
        </div>
      </SRLWrapper>
    </Layout>
  );
};

export const query = graphql`
  query PaintingQuery {
    allPaintings: allMdx(
      filter: { fields: { collection: { eq: "paintings" } } }
    ) {
      edges {
        node {
          id
          body
          excerpt
          fields {
            collection
            slug
          }
          frontmatter {
            title
            image {
              publicURL
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
                fixed(width: 300, height: 300) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    }
  }
`;
