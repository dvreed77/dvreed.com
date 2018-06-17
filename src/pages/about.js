import React from "react";

export default ({data}) => (
  <div>
    <p>
      Hi! Im Dave. I am a data scientist at Thomson Reuters and ...
    </p>
  </div>
);

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`