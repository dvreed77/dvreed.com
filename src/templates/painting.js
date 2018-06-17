import React from "react";

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div>
      <img src={data.markdownRemark.frontmatter.image.childImageSharp.resize.src} alt=""/>

      <a href={data.markdownRemark.frontmatter.image.publicURL}>LINK</a>
      <div
        dangerouslySetInnerHTML={{__html: data.markdownRemark.html}}
      />
    </div>

  );
};

export const pageQuery = graphql`
  query PaintingQuery2($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        date
        image {
          publicURL
          childImageSharp {
            resize(width: 800) {
              src
            }
          }
        }
      }
      fields {
        path
        slug
      }
    }
  }
`;