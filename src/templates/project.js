import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components'
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import Layout from "../layouts"

const Img = styled.img`
  margin: 0 auto;
  display: block;
  max-width: 100%;
  border: solid 1px #eee;
`

const Body = styled.div`

  a {
    color: steelblue;

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
    border-top: 1px solid black;
    margin-top: 44px;
    padding-top: 40px;
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
    font-size: 20px;
    color: black;
    line-height: 1.3;
    margin-top: 50px;
    font-weight: 400,
  }

  & h4 + p {
    margin-top: 20px;
  }
`

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

const Project = ({data, location}) => {
  // HACK The injected location prop doesn't update when hash changes
  // This might be a gatsby issue, or a react-router/history issue,
  // Or we might be using either library incorrectly.
  // For now this patch keeps the hash in sync by JIT copying it from window.
  // The undefined check prevents us from breaking on production build.
  // if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
  //   location.hash = window.location.hash;
  // }

  const markdownRemark = data.markdownRemark

  return (
    <Layout location={location}>
    <div>
      <TitleAndMetaTags
        ogDescription={"dave"}
        ogUrl={"dave"}
        title={"Projects"}
      />

      <h1>
        {markdownRemark.frontmatter.title}
      </h1>    

      <a 
        href={markdownRemark.frontmatter.repoURL}
        target="_blank"
      >
        Repository
      </a>

      <a 
        href={markdownRemark.frontmatter.projectURL}
        target="_blank"
      >
        Project
      </a>

      <div>
        {markdownRemark.frontmatter.startDate} to {markdownRemark.frontmatter.endDate}
      </div>
      
      <a 
        href={markdownRemark.frontmatter.projectURL}
        target="_blank"
      >
        <Img src={markdownRemark.frontmatter.images[0].publicURL} alt=""/>
      </a>      
      
      <Body
        dangerouslySetInnerHTML={{__html: markdownRemark.html}}
      />
      
    </div>
    </Layout>
  );
};

// Tutorial.propTypes = {
//   data: PropTypes.object.isRequired,
// };

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query TemplateProjectMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        startDate
        endDate
        repoURL
        projectURL
        images {
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

export default Project;
