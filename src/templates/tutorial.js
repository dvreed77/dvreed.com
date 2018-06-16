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

const Tutorial = ({data, location}) => {
  // HACK The injected location prop doesn't update when hash changes
  // This might be a gatsby issue, or a react-router/history issue,
  // Or we might be using either library incorrectly.
  // For now this patch keeps the hash in sync by JIT copying it from window.
  // The undefined check prevents us from breaking on production build.
  if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    location.hash = window.location.hash;
  }

  return (
    <div>
      Tutorial
    </div>
  );
};

// Tutorial.propTypes = {
//   data: PropTypes.object.isRequired,
// };

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query TemplateTutorialMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
      }
      fields {
        path
        slug
      }
    }
  }
`;

export default Tutorial;
