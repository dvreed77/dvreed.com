import React from "react";
import SimpleReactLightbox from "simple-react-lightbox";

import "./src/styles/global.css";
import "katex/dist/katex.min.css";
import "./src/styles/my-prism-theme.css";

export const wrapRootElement = ({ element }) => {
  return <SimpleReactLightbox>{element}</SimpleReactLightbox>;
};
