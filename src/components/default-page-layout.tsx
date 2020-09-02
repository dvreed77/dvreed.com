import React from "react";
import { Layout } from "./Layout";

const DefaultMDXPage = ({ children }) => (
  <Layout>
    <div className="mdx">{children}</div>
  </Layout>
);

export default DefaultMDXPage;
