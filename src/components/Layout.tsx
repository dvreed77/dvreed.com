import React from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";

export function Layout({ children }) {
  return (
    <div className="text-gray-800 lg:max-w-2xl max-w-sm mx-auto px-2">
      <Helmet>
        <meta charSet="utf-8" />
        <meta property="og:url" content="https://dvreed.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Dave Reed" />
        <meta
          property="og:description"
          content="Portfolio Site for Dave Reed, a practicing software engineer, data scientist, creative coder."
        />
        <meta name="description" content="Portfolio Site for Dave Reed" />
        <meta
          name="keywords"
          content="data, software engineering, data visualization, information design"
        />
        <title>Dave Reed</title>
        <link rel="canonical" href="https://dvreed.com" />
      </Helmet>
      <header className="my-2 flex justify-between">
        <Link to="/">
          <h1>Dave Reed</h1>
        </Link>
        <div className="flex">
          <Link to={"/about"}>About</Link>
          <Link className="ml-3" to={"/paintings"}>
            Paintings
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
