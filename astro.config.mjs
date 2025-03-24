import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  integrations: [
    mdx({
      optimize: false,
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex]
    }),
    react(),
    tailwind()
  ],
  markdown: {
    shikiConfig: {
      theme: "min-light",
      langs: []
    }
  }
});
