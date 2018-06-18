import React from "react";
import Layout from "../layouts"

export default ({data, location}) => (
  <Layout location={location}>
    <p>
      Hi! Im Dave. During the day, I am a data scientist at Thomson Reuters Labs in Boston, where I do typical data sciency things like building ML models, etc, but more often than not, I am building Proof of Concepts (PoC's) that require me to know the entire software stack. I have typically been very Python heavy with some Javascript, but have found myself leaning more and more to a full Javascript stack, the web community is just moving much faster with Node/JS than with Python. 
    </p>
  </Layout>
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