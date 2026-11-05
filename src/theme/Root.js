/* eslint-disable react/prop-types */
import React from "react";
import Head from "@docusaurus/Head";

// Puts the docs on the Grey surface of the shared colour tokens
// (src/css/tokens.css), like the blog. <Head> writes the attribute onto
// <html> in the server render, so the first paint already has it.
export default function Root({ children }) {
  return (
    <>
      <Head>
        <html data-surface="blog" />
      </Head>
      {children}
    </>
  );
}
