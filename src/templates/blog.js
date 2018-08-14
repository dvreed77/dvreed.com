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
import styled from 'styled-components'
import Layout from "../layouts"



const TitleAndMetaTags = ({title, ogDescription, ogUrl}) => {
  return (
    <Helmet title={title}>
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:image" content="/logo-og.png" />
      <meta property="fb:app_id" content="623268441017527" />
    </Helmet>
  );
};

const Body = styled.div`

  a {
    color: steelblue;
    font-weight: 500;

    :hover {
      text-decoration: underline;
    }
  }

  a.anchor {
    color: inherit;
    fill: steelblue;
    text-decoration: none;
    border-bottom: none;
    box-shadow: none;
  }

  p {
    margin: 0 auto;
    margin-top: 30px;
    font-size: 17px;
    line-height: 1.7;
    // max-width: 42em;
  }

  ul {
    list-style: disc;
    margin-top: 20px;
    font-size: 16px;
    color: #1a1a1a;
    padding-left: 20px;
  }

  ul li {
    margin-top: 10px;
  }

  & h3 + p, & h3 + p:first-of-type {
    margin-top: 20px;
  }

  & h1 {
    line-height: 1.2;

    // [media.size('xsmall')] {
    //   fontSize: 30,
    // },

    // [media.between('small', 'large')]: {
    //   fontSize: 45,
    // },

    // [media.greaterThan('xlarge')]: {
    //   fontSize: 60,
    // },
  }

  & h2 {
    border-bottom: 1px solid #ddd;
    margin-top: 44px;
    padding-top: 10px;
    line-height: 1.2

    :first-child {
      border-top: 0;
      margin-top: 0;
      padding-top: 0;
    };

    [media.lessThan('large')]: {
      fontSize: 20,
    },
    [media.greaterThan('xlarge')]: {
      fontSize: 35,
    },
  },

  & hr + h2 {
    border-top: 0;
    margin-top: 0;
  }

  & h3 {
    font-weight: 400;
    font-size: 22px;
    padding-top: 45px;

    [media.lessThan('small')]: {
      wordBreak: 'break-all',
    },

    [media.greaterThan('xlarge')]: {
      fontSize: 25,
      lineHeight: 1.3,
    }
  }

  & h2 + h3, & h2 + h3:first-of-type {
    padding-top: 30px;
  }

  & h4 {
    font-size: 18px;
    color: #555;
    line-height: 1.3;
    margin-top: 20px;
    margin-bottom: 20px;
    font-weight: 200;
  }

  & h4 + p {
    margin-top: 20px;
  }
`

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

const Details = styled.div`
  margin-bottom: 30px;

  h1 {
    margin-bottom: 10px;
  }

  li {
    span {
      // text-transform: uppercase;
      font-weight: 500;
      margin-right: 10px;
    }
  }
  a {
    color: steelblue;
    font-weight: 500;
    :hover {
      text-decoration: underline;
    }
  }
`

const Blog = ({data, location}) => {
  console.log('Blog Data', data, location)

  const markdownRemark = data.markdownRemark
  return (
    <Layout location={location}>
      <div>
        <TitleAndMetaTags
          ogDescription={"dave"}
          ogUrl={"dave"}
          title={"Blog"}
        />

        <Details>
          <h1>
            {markdownRemark.frontmatter.title}
          </h1>
        </Details>    

        
        <Body
          dangerouslySetInnerHTML={{__html: markdownRemark.html}}/>
        
        
      </div>
    </Layout>
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
  }
`;

export default Blog;
