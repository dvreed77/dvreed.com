import React from "react";
import { Link } from "gatsby";

export function Layout({ children }) {
  return (
    <div className="text-gray-800 max-w-2xl mx-auto">
      <header style={{ marginBottom: `1.5rem` }}>
        <Link to="/" style={{ textShadow: `none`, backgroundImage: `none` }}>
          <h3 style={{ display: `inline` }}>Dave Reed</h3>
        </Link>
        <ul style={{ listStyle: `none`, float: `right` }}>
          <li style={{ display: `inline-block`, marginRight: `1rem` }}>
            <Link to={"/about"}>About</Link>
          </li>
          <li style={{ display: `inline-block`, marginRight: `1rem` }}>
            <Link to={"/paintings"}>Paintings</Link>
          </li>
        </ul>
      </header>
      {children}
    </div>
  );
}
