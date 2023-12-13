import React, { useEffect } from "react";
import NotFound from "@theme-original/NotFound";

import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export default function NotFoundWrapper(props) {
  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM && window.posthog) {
      window.posthog.capture("404NotFound");
    }
  }, []);

  return (
    <>
      <NotFound {...props} />
    </>
  );
}
