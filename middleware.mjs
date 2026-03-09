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
    return;
  }

  const accept = request.headers.get("accept") || "";

  if (accept.includes("text/markdown")) {
    // The docusaurus-plugin-llms generates .md files under a docs/ subdirectory
    // within the build output. With baseUrl "/docs/", the .md files are served at
    // /docs/docs/<path>.md on the deployed site.
    //
    // Rewrite HTML URL to its .md equivalent:
    // /docs/overview/ -> /docs/docs/overview.md
    // /docs/cli/cp/   -> /docs/docs/cli/cp.md
    // /docs/          -> /docs/docs/index.md
    const subpath = pathname.replace(/^\/docs\/?/, "").replace(/\/+$/, "");
    let mdPath;
    if (!subpath) {
      mdPath = "/docs/docs/index.md";
    } else {
      mdPath = `/docs/docs/${subpath}.md`;
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
    },
  });
}
