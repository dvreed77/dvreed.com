/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import PropTypes from 'prop-types';
import React from 'react';
// import MarkdownPage from 'components/MarkdownPage';
// import {createLinkBlog} from 'utils/createLink';
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


// const toSectionList = allMarkdownRemark => [
//   {
//     title: 'Recent Posts',
//     items: allMarkdownRemark.edges
//       .map(({node}) => ({
//         id: node.fields.slug,
//         title: node.frontmatter.title,
//       }))
//       .concat({
//         id: '/blog/all.html',
//         title: 'All posts ...',
//       }),
//   },
// ];

const Blog = ({data, location}) => {
  console.log('Blog Data', data, location)

  const markdownRemark = data.markdownRemark
  return (
    <div>
      <TitleAndMetaTags
        ogDescription={"dave"}
        ogUrl={"dave"}
        title={"Blog"}
      />

      <div>
        <div
          dangerouslySetInnerHTML={{__html: markdownRemark.html}}
        />
      </div>
      Blog
    </div>
  )
}

// Blog.propTypes = {
//   data: PropTypes.object.isRequired,
// };

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query TemplateBlogMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      excerpt(pruneLength: 500)
      frontmatter {
        title
      }
      fields {
        date(formatString: "MMMM DD, YYYY")
        path
        slug
      }
    }
    allMarkdownRemark(
      limit: 10
      filter: {id: {regex: "/blog/"}}
      sort: {fields: [fields___date], order: DESC}
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default Blog;
