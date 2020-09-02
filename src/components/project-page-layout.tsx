import React from "react";
import { graphql } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Link } from "gatsby";
import { Layout } from "./Layout";
import Img from "gatsby-image";

const shortcodes = { Link }; // Provide common components here

export default function PageTemplate({ data: { mdx } }) {
  console.log(mdx);

  // let featuredImgFluid = mdx.frontmatter.featuredImage.childImageSharp.fluid

  return (
    <Layout>
      <div>
        <Img fluid={mdx.frontmatter.images[0].childImageSharp.fluid} />

        <div className="flex flex-row my-5">
          <div className="w-3/5 mr-5">
            <h1 className="text-4xl font-bold border-b border-gray-300">
              {mdx.frontmatter.title}
            </h1>
            <div className="mdx">
              <MDXProvider components={shortcodes}>
                <MDXRenderer>{mdx.body}</MDXRenderer>
              </MDXProvider>
            </div>
          </div>
          <aside className="w-2/5">
            <div className="mb-3">
              <h2 className="text-gray-800 font-bold border-b border-gray-300">
                Created
              </h2>
              <div className="font-thin text-sm">
                {mdx.frontmatter.startDate === mdx.frontmatter.endDate
                  ? mdx.frontmatter.startDate
                  : `${mdx.frontmatter.startDate} to ${mdx.frontmatter.endDate}`}
              </div>
            </div>

            <div className="mb-3">
              {" "}
              <h2 className="text-gray-800 font-bold border-b border-gray-300">
                Code
              </h2>
              <div className="font-thin text-sm">
                <a href={mdx.frontmatter.repoURL}>{mdx.frontmatter.repoURL}</a>
              </div>
            </div>

            <div className="mb-3">
              <h2 className="text-gray-800 font-bold border-b border-gray-300">
                Project
              </h2>
              <div className="font-thin text-sm">
                <a href={mdx.frontmatter.projectURL}>
                  {mdx.frontmatter.projectURL}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
export const pageQuery = graphql`
  query ProjectQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        startDate(formatString: "MMMM YYYY")
        endDate(formatString: "MMMM YYYY")
        repoURL
        projectURL

        images {
          publicURL
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
