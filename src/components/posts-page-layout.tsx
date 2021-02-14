import React from "react";
import { graphql } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Link } from "gatsby";
import { Layout } from "./Layout";

const shortcodes = { Link }; // Provide common components here

export const DataContext = React.createContext<
  [{ [key: string]: any }, React.Dispatch<React.SetStateAction<{}>>]
>([{}, () => {}]);

export default function PageTemplate({ data: { mdx } }) {
  const state = React.useState({});

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">{mdx.frontmatter.title}</h1>
      <div className="mdx">
        <DataContext.Provider value={state}>
          <MDXProvider components={shortcodes}>
            <MDXRenderer>{mdx.body}</MDXRenderer>
          </MDXProvider>
        </DataContext.Provider>
      </div>
    </Layout>
  );
}
export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
      }
    }
  }
`;
