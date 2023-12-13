const defaultImg =
  "https://vercel-og-tigris.vercel.app/api/param?title=Serverless%20NoSQL%20Database%20and%20Search%20Platform";

// getImage returns the share image URL for a page/blog post. Order of evaluation is:
// the `image` attribute in the document front-matter, the `shareText` attribute in the
// document `front-matter`, the document's title, and finally the default image.
export function getImage(metadata) {
  const { frontMatter, title } = metadata;
  if (frontMatter.image) {
    return frontMatter.image;
  }
  if (frontMatter.shareText) {
    return `https://vercel-og-tigris.vercel.app/api/param?title=${encodeURIComponent(
      frontMatter.shareText
    )}`;
  }
  if (title) {
    return `https://vercel-og-tigris.vercel.app/api/param?title=${encodeURIComponent(
      title
    )}`;
  }
  return defaultImg;
}
