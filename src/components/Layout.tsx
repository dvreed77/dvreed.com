import React from "react";
import { Link } from "gatsby";

export function Layout({ children }) {
  return (
    <div className="text-gray-800 lg:max-w-2xl max-w-sm mx-auto">
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
