import React from "react";
import { Link, graphql } from "gatsby";
import { Layout } from "../components/Layout";
import Img from "gatsby-image";

export default function Home({ data }) {
  console.log(data);
  const { edges: posts } = data.allPosts;
  const { edges: projects } = data.allProjects;

  return (
    <Layout>
      <h1 className="text-3xl border-b border-gray-300 mb-5 pb-1 text-gray-800">
        Projects
      </h1>
      {projects.map(({ node: project }) => (
        <Link key={project.id} to={project.fields.slug}>
          <div className="mb-10">
            <div className="h-6">
              <Img
                className="h-6"
                imgStyle={{ objectFit: "none" }}
                fluid={project.frontmatter.images[0].childImageSharp.fluid}
                // fixed={project.frontmatter.images[0].childImageSharp.fixed}
              />
            </div>
            <h2 className="text-center text-4xl leading-tight font-semibold group-hover:text-gray-600">
              {project.frontmatter.title}
            </h2>
            <div className="text-center text-gray-600">
              {project.frontmatter.startDate}
            </div>
          </div>
        </Link>
      ))}

      <h1 className="text-3xl border-b border-gray-300 mb-5 pb-1 text-gray-800">
        Explorations
      </h1>

      <ul>
        {posts.map(({ node: post }) => (
          <li key={post.id}>
            <Link to={post.fields.slug}>
              <div className="flex flex-row">
                <span className="text-gray-600 font-hairline">
                  {post.frontmatter.date}
                </span>
                <span className="mx-5 text-gray-600 font-hairline">-</span>
                <h2>{post.frontmatter.title}</h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export const pageQuery = graphql`
  query {
    allPosts: allMdx(
      filter: { fields: { collection: { eq: "posts" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          id
          excerpt
          fields {
            collection
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM YYYY")
          }
        }
      }
    }

    allProjects: allMdx(
      filter: { fields: { collection: { eq: "projects" } } }
      sort: { fields: [frontmatter___startDate], order: DESC }
    ) {
      edges {
        node {
          id
          fields {
            collection
            slug
          }
          frontmatter {
            title
            startDate(formatString: "MMMM YYYY")
            images {
              childImageSharp {
                fluid(cropFocus: ENTROPY) {
                  ...GatsbyImageSharpFluid
                }
                fixed(width: 1000) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    }
  }
`;
