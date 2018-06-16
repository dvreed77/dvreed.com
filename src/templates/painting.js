import React from "react";

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div>
      Painting
      <img src={data.markdownRemark.frontmatter.image.publicURL} alt=""/>

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
        }
      }
      fields {
        path
        slug
      }
    }
  }
`;