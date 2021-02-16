import React from "react";
import { Layout } from "./Layout";

const DefaultPageTemplate = ({ children }) => (
  <Layout>
    <div className="mdx">{children}</div>
  </Layout>
);

export default DefaultPageTemplate;
