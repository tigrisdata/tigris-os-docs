function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

let pollInProgress = false;
let lastPageviewUrl = null;

function startRb2bPostHogBridge() {
  // A poll is already running for this page-load; don't start a parallel one.
  if (pollInProgress) return;

  // tigris_geo may be absent on the very first render (e.g., the edge
  // middleware didn't reach this specific request). Only commit to a poll
  // once the cookie has actually been seen as US/CA — otherwise leave the
  // door open for retries on subsequent route changes.
  const country = getCookie("tigris_geo");
  if (country !== "US" && country !== "CA") return;

  // Already identified as an rb2b person — nothing to do.
  const posthog = window.posthog;
  if (
    posthog &&
    posthog.__loaded &&
    typeof posthog.get_distinct_id === "function" &&
    String(posthog.get_distinct_id() ?? "").startsWith("rb2b_")
  ) {
    return;
  }

  pollInProgress = true;
  let attempts = 0;
  const iv = window.setInterval(() => {
    attempts++;
    const uid = getCookie("_reb2buid");
    const ph = window.posthog;
    if (uid && ph && typeof ph.identify === "function") {
      ph.identify(`rb2b_${uid}`);
      ph.register({ rb2b_visitor_id: uid });
      pollInProgress = false;
      window.clearInterval(iv);
    } else if (attempts >= 60) {
      // 30s of polling without a cookie — give up for this attempt but allow
      // a future route change to start a fresh poll if the cookie shows up.
      pollInProgress = false;
      window.clearInterval(iv);
    }
  }, 500);
}

export function onRouteDidUpdate({ location, previousLocation }) {
  if (typeof window === "undefined") return;

  if (location.pathname !== previousLocation?.pathname) {
    // posthog-docusaurus auto-captures $pageview on each route change but
    // does not emit a corresponding $pageleave for the page being left —
    // PostHog's built-in pageleave only fires on real tab close /
    // visibilitychange. Without an explicit $pageleave, dwell-time math
    // for per-page sessions is wrong. Emit it manually using the URL we
    // recorded for the previous $pageview so the two events align.
    const posthog = window.posthog;
    if (posthog && typeof posthog.capture === "function" && lastPageviewUrl) {
      posthog.capture("$pageleave", { $current_url: lastPageviewUrl });
    }
    lastPageviewUrl = window.location.href;
  }

  startRb2bPostHogBridge();
}
