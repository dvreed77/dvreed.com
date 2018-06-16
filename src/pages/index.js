import React from "react";
import g from "glamorous";
import Link from "gatsby-link";

import { rhythm } from "../utils/typography";

import Helmet from 'react-helmet';


const TitleAndMetaTags = ({title, ogDescription, ogUrl}) => {
  return (
    <Helmet title={title}>
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:image" content="/logo-og.png" />
      <meta
        property="og:description"
        content={ogDescription || defaultDescription}
      />
      <meta property="fb:app_id" content="623268441017527" />
    </Helmet>
  );
};


export default ({ data }) => {
  return (
    <div>
      <TitleAndMetaTags
        ogDescription={"dave"}
        ogUrl={"dave"}
        title={"Dave Reed"}
      />
      <h4>
        {data.allMarkdownRemark.totalCount} Projects
      </h4>
      {data.allMarkdownRemark.edges.map(({ node }) =>
        <div key={node.id} style={{marginBottom: '90px'}}>
          <Link
            to={node.fields.slug}
            css={{ textDecoration: `none`, color: `inherit` }}
          >
            <div style={{display: 'flex'}}>
              <div style={{marginRight: 30}}>
                <img width='150px' src={node.frontmatter.images[0].publicURL} alt=""/>
              </div>
              <div>
                <g.H3 marginBottom={rhythm(1 / 4)}>
                  {node.frontmatter.title}
                </g.H3>
                <g.Span color="#BBB">{node.frontmatter.startDate}</g.Span>
              </div>
              
            </div>            
            <p>
              {node.excerpt}
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}

// export const query = graphql`
//   query IndexQuery {
//     allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
//       totalCount
//       edges {
//         node {
//           id
//           frontmatter {
//             title
//             date(formatString: "DD MMMM, YYYY")
//           }
//           fields {
//             slug
//           }
//           excerpt
//         }
//       }
//     }
//   }
// `

export const query = graphql`
query IndexQuery {
  allMarkdownRemark(
    filter: {id: {regex: "/projects/"}}
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
            publicURL
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