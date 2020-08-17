import React from "react"
import { Link, graphql } from "gatsby"
import { Layout } from "../components/Layout"
import Img from "gatsby-image"

export default function Home({ data }) {
  console.log(data)
  const { edges: posts } = data.allPosts
  const { edges: projects } = data.allProjects

  return (
    <Layout>
      {projects.map(({ node: project }) => (
        <Link key={project.id} to={project.fields.slug}>
          <div className="flex flex-row my-4 group">
            <div className="w-1/3 h-32">
              <Img
                className="h-32"
                imgStyle={{ objectFit: "none" }}
                fluid={project.frontmatter.images[0].childImageSharp.fluid}
              />
            </div>
            <div className="w-2/3 ml-4">
              <h2 className="text-xl font-semibold group-hover:text-gray-600">
                {project.frontmatter.title}
              </h2>
            </div>
          </div>
        </Link>
      ))}

      <ul>
        {posts.map(({ node: post }) => (
          <li key={post.id}>
            <Link to={post.fields.slug}>
              <h2>{post.frontmatter.title}</h2>
            </Link>
            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </Layout>
    // <div className="home">
    //   <div className="mx-auto max-w-4xl">
    //     <div className="flex flex-row justify-between">
    //       <div>
    //         <h1 className="text-4xl">Dave Reed</h1>
    //         <h2 className="text-sm text-gray-600 uppercase font-light">
    //           Creative Coder
    //         </h2>
    //       </div>
    //       <div>
    //         <Link className="mr-5" to="/portfolio">
    //           Portfolio
    //         </Link>
    //         <Link className="mr-5" to="/explainer">
    //           Explorations
    //         </Link>
    //         <Link className="mr-5" to="/blog">
    //           About
    //         </Link>
    //       </div>
    //     </div>
    //     <ul>
    //       {posts.map(({ node: post }) => (
    //         <li key={post.id}>
    //           <Link to={post.fields.slug}>
    //             <h2>{post.frontmatter.title}</h2>
    //           </Link>
    //           <p>{post.excerpt}</p>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
  )
}

export const pageQuery = graphql`
  query {
    allPosts: allMdx(filter: { fields: { collection: { eq: "posts" } } }) {
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
          }
        }
      }
    }

    allProjects: allMdx(
      filter: { fields: { collection: { eq: "projects" } } }
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
            images {
              childImageSharp {
                fluid(maxWidth: 500, maxHeight: 200, cropFocus: ENTROPY) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
