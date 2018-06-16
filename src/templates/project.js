/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

// import MarkdownPage from 'components/MarkdownPage';
import PropTypes from 'prop-types';
import React from 'react';
// import {createLinkTutorial} from 'utils/createLink';
// import {sectionListTutorial} from 'utils/sectionList';
import styled from 'styled-components'
import Helmet from 'react-helmet';
import Link from 'gatsby-link';

const Img = styled.img`
  margin: 0 auto;
  display: block;
`

const Body = styled.div`
  p {
    margin: 0 auto;
    margin-top: 30px;
    font-size: 17px;
    line-height: 1.7;
    // max-width: 42em;
  }
`

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

const Project = ({data, location}) => {
  // HACK The injected location prop doesn't update when hash changes
  // This might be a gatsby issue, or a react-router/history issue,
  // Or we might be using either library incorrectly.
  // For now this patch keeps the hash in sync by JIT copying it from window.
  // The undefined check prevents us from breaking on production build.
  if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    location.hash = window.location.hash;
  }

  const markdownRemark = data.markdownRemark

  console.log(markdownRemark)

  return (
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
      
      <Img src={markdownRemark.frontmatter.images[0].publicURL} alt=""/>
      
      <Body
        dangerouslySetInnerHTML={{__html: markdownRemark.html}}
      />
      
    </div>
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
