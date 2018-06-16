import React from "react";

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div>
      Painting
    </div>
  );
};

export const query = graphql`
  query Blog2PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;