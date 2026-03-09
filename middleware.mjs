/* global URL, Response */
import { next } from "@vercel/edge";

const STATIC_EXTENSIONS =
  /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|xml|txt|md|map)$/i;

export const config = {
  matcher: "/docs/:path*",
};

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip static assets
  if (STATIC_EXTENSIONS.test(pathname)) {
    return next();
  }

  const accept = request.headers.get("accept") || "";

  if (accept.includes("text/markdown")) {
    // The @signalwire/docusaurus-plugin-llms-txt generates .md files at the
    // route path (e.g., build/overview.md). With baseUrl "/docs/", these are
    // served at /docs/<path>.md on the deployed site.
    //
    // Rewrite HTML URL to its .md equivalent:
    // /docs/overview/ -> /docs/overview.md
    // /docs/cli/cp/   -> /docs/cli/cp.md
    // /docs/          -> /docs/index.md
    const subpath = pathname.replace(/^\/docs\/?/, "").replace(/\/+$/, "");
    let mdPath;
    if (!subpath) {
      mdPath = "/docs/index.md";
    } else {
      mdPath = `/docs/${subpath}.md`;
    }

    return new Response(null, {
      status: 307,
      headers: {
        Location: new URL(mdPath, request.url).toString(),
        Vary: "Accept",
      },
    });
  }

  // For normal HTML requests, add Link header pointing to llms.txt for discovery
  return next({
    headers: {
      Link: '</docs/llms.txt>; rel="alternate"; type="text/plain"',
      Vary: "Accept",
    },
  });
}
