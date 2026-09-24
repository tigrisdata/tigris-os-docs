import React, {
  JSX,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import type { TigrisShellProps } from "@tigrisdata/cli-shell";
import { primeLoginPopup } from "./loginPopup";
import styles from "./styles.module.css";

import "@xterm/xterm/css/xterm.css";
import "@tigrisdata/cli-shell/styles.css";

const ACCENT = "\x1b[32m";
const RESET = "\x1b[0m";

/**
 * Replaces the package's box-art banner, which fills most of the box. Every
 * line is at most 34 columns, so it does not wrap on a 360px phone.
 */
const WELCOME = [
  `Run ${ACCENT}tigris help${RESET} to list commands.`,
  `Run ${ACCENT}tigris login${RESET} for your buckets.`,
  "",
].join("\n");

/**
 * The Tigris CLI running in the browser, from `@tigrisdata/cli-shell`.
 *
 * The package touches `window` and xterm measures real DOM nodes, so it is
 * imported in an effect and never evaluated during the static render. Its
 * `exports` map only has an `import` condition, which a dynamic `import()`
 * resolves.
 */
export default function CliShell(): JSX.Element {
  const hostRef = useRef<HTMLDivElement>(null);
  const [Shell, setShell] = useState<ComponentType<TigrisShellProps> | null>(
    null,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    import("@tigrisdata/cli-shell")
      .then(({ TigrisShell }) => {
        // A function passed to a state setter is called, so wrap it.
        if (!disposed) setShell(() => TigrisShell);
      })
      .catch((err) => {
        console.error("cli-shell failed to load", err);
        if (!disposed) setFailed(true);
      });
    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!Shell || !host) return;

    // The shell refits the terminal only on a window resize. Here the box
    // also changes width when the docs sidebar collapses, so forward every
    // box resize to the shell's own handler.
    const observer = new window.ResizeObserver(() =>
      window.dispatchEvent(new Event("resize")),
    );
    observer.observe(host);
    const unprime = primeLoginPopup(host);
    return () => {
      observer.disconnect();
      unprime();
    };
  }, [Shell]);

  return (
    <div className={styles.frame}>
      <div className={styles.titleBar}>
        <span>tigris</span>
        <span className={styles.hint}>runs in this tab</span>
      </div>
      <div ref={hostRef} className={styles.host}>
        {Shell ? (
          <Shell welcome={WELCOME} className={styles.shell} />
        ) : (
          <div className={styles.placeholder}>
            {failed ? "The shell failed to load." : "Starting shell…"}
          </div>
        )}
      </div>
    </div>
  );
}
