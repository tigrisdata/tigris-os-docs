/**
 * Keep the browser from blocking the CLI's login window.
 *
 * Copied from the website's homepage shell (tigrisdata/website,
 * src/components/login-popup.ts). Keep the two in step until the fix moves
 * into @tigrisdata/cli-shell.
 *
 * `tigris login` signs in through Auth0's popup flow. The popup is opened
 * only after the shell has parsed the line, built the Auth0 client and
 * checked for an existing session, which is several async hops after the
 * Enter key that asked for it. Safari drops the user activation at the first
 * of those hops, and Chrome drops it after five seconds, so `window.open`
 * returns null and the CLI prints "Unable to open a popup for loginWithPopup".
 *
 * The fix is to open the window ourselves, synchronously, inside the keydown
 * that submits the login, under the same name Auth0 uses. When Auth0 later
 * calls `window.open('', 'auth0:authorize:popup', …)` the browser hands back
 * the window that already exists with that name instead of trying to create
 * one, and nothing is blocked. If Auth0 never takes the window over (the
 * visitor picked the access-key option, say) it is closed again.
 */

// the name auth0-spa-js gives its popup; it has to match exactly
const POPUP_NAME = "auth0:authorize:popup";
const POPUP_W = 400;
const POPUP_H = 600;
// how long Auth0 gets to navigate the window before we assume it will not
const ADOPT_TIMEOUT_MS = 12_000;

// `tigris login` on its own shows the menu first, so only the direct form
// opens the window from the command line
const LOGIN_COMMAND = /\$\s+(?:tigris|t3)\s+login\s+oauth\s*$/;
// the CLI's own menu: "Select [1]:" with the default, or "1", typed after it
const LOGIN_MENU_CHOICE = /Select \[1\]:\s*1?\s*$/;

let pending: Window | null = null;
let adoptTimer: number | null = null;

/** The text of the row the cursor is on, as xterm has rendered it. */
function currentLine(root: HTMLElement): string {
  const rows = root.querySelectorAll<HTMLElement>(".xterm-rows > div");
  for (let i = rows.length - 1; i >= 0; i--) {
    const text = rows[i].textContent?.replace(/\u00a0/g, " ").trim() ?? "";
    if (text) return text;
  }
  return "";
}

function isLoginSubmit(line: string): boolean {
  return LOGIN_COMMAND.test(line) || LOGIN_MENU_CHOICE.test(line);
}

function closePending() {
  if (adoptTimer !== null) {
    window.clearTimeout(adoptTimer);
    adoptTimer = null;
  }
  if (pending && !pending.closed) {
    try {
      pending.close();
    } catch {
      /* already gone */
    }
  }
  pending = null;
}

/** True once Auth0 has pointed the window at the authorize URL. */
function adopted(win: Window): boolean {
  try {
    // same-origin while it is still about:blank; cross-origin (throws) once
    // it has been sent to Auth0
    return win.location.href !== "about:blank";
  } catch {
    return true;
  }
}

function openPending() {
  closePending();
  const left = window.screenX + Math.max(0, (window.innerWidth - POPUP_W) / 2);
  const top = window.screenY + Math.max(0, (window.innerHeight - POPUP_H) / 2);
  const features = `left=${Math.round(left)},top=${Math.round(top)},width=${POPUP_W},height=${POPUP_H},resizable,scrollbars=yes,status=1`;
  try {
    pending = window.open("", POPUP_NAME, features);
  } catch {
    pending = null;
  }
  if (!pending) return;
  adoptTimer = window.setTimeout(() => {
    if (pending && !pending.closed && !adopted(pending)) closePending();
    else {
      adoptTimer = null;
      pending = null;
    }
  }, ADOPT_TIMEOUT_MS);
}

/**
 * Attach to the element that contains the terminal. Runs in the capture
 * phase so it sees Enter before xterm consumes it.
 */
export function primeLoginPopup(root: HTMLElement): () => void {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Enter" || e.isComposing) return;
    if (isLoginSubmit(currentLine(root))) openPending();
  };
  root.addEventListener("keydown", onKeyDown, true);
  return () => {
    root.removeEventListener("keydown", onKeyDown, true);
    closePending();
  };
}
