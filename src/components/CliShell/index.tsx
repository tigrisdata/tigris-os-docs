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

/**
 * Columns the shell's default banner needs: fixed-width box art with borders
 * in the first and last column, so any narrower and every line wraps.
 */
const BANNER_COLUMNS = 69;

/**
 * Columns the terminal gets in a host `width` px wide: the shell's 12px
 * padding on each side, 14px for the fit addon's scrollbar gutter, and a 13px
 * font whose cell is at most 0.605em wide in the shell's font stack.
 */
function columnsFor(width: number): number {
  return Math.floor((width - 2 * 12 - 14) / (13 * 0.605));
}

const ACCENT = "\x1b[32m";
const ACCENT_BOLD = "\x1b[1;32m";
const RESET = "\x1b[0m";

/**
 * The welcome for hosts too narrow for the banner: the same content without
 * the box art, every line at most 30 columns (a 320px phone has ~33). Taken
 * from the website's /try-cli page, minus its docs link.
 */
const COMPACT_WELCOME = [
  `${ACCENT_BOLD}TIGRIS CLI${RESET}`,
  "",
  "The real CLI, in your browser.",
  "",
  "Get started:",
  `  $ ${ACCENT}tigris login${RESET}`,
  "",
  "For help:",
  `  $ ${ACCENT}tigris help${RESET}`,
  "",
  `Tip: ${ACCENT}t3${RESET} is short for ${ACCENT}tigris${RESET}.`,
  "",
].join("\n");

interface LoadedShell {
  Shell: ComponentType<TigrisShellProps>;
  /** `undefined` keeps the package's own banner. */
  welcome?: string;
}

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
  const [loaded, setLoaded] = useState<LoadedShell | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    import("@tigrisdata/cli-shell")
      .then(({ TigrisShell }) => {
        if (disposed) return;
        // The shell reads `welcome` once, when it mounts, so pick it from the
        // host width now. A later resize keeps the first choice in scrollback.
        const width = hostRef.current?.clientWidth ?? 0;
        setLoaded({
          Shell: TigrisShell,
          welcome:
            columnsFor(width) < BANNER_COLUMNS ? COMPACT_WELCOME : undefined,
        });
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
    if (!loaded || !host) return;

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
  }, [loaded]);

  return (
    <div className={styles.frame}>
      <div className={styles.titleBar}>
        <span>tigris</span>
        <span className={styles.hint}>runs in this tab</span>
      </div>
      <div ref={hostRef} className={styles.host}>
        {loaded ? (
          <loaded.Shell welcome={loaded.welcome} className={styles.shell} />
        ) : (
          <div className={styles.placeholder}>
            {failed ? "The shell failed to load." : "Starting shell…"}
          </div>
        )}
      </div>
    </div>
  );
}
