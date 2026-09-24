/* global HTMLDivElement, MouseEvent, KeyboardEvent, Node */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  useLockBodyScroll,
  useNavbarMobileSidebar,
  useNavbarSecondaryMenu,
} from "@docusaurus/theme-common/internal";
import SearchBar from "@theme/SearchBar";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import clsx from "clsx";
import tigrisConfig from "@site/tigris.config";
import styles from "./styles.module.css";

/**
 * Docs top nav. It is the website's bar (tigrisdata/website,
 * src/components/Navbar.tsx; tigris-blog/src/theme/Navbar is an exact copy),
 * simplified for the docs: same height, background, border, logo, type and
 * Sign in / Get started buttons, so the logo and buttons don't move when you
 * click between the homepage, the blog and the docs. Instead of the
 * Product / Developers / Company menus it has:
 *
 *   logo | Docs          [ Search docs...  Ctrl K ]     Changelog  theme  Sign in  Get started
 *
 * The search box is centred in the bar. Below 997px (Docusaurus' mobile
 * breakpoint, where the docs sidebar leaves the page) the bar keeps the logo
 * and "Docs", the search becomes an icon, and the menu button opens a sheet
 * with the docs sidebar, Changelog, the theme toggle and the two buttons.
 * The sheet reuses Docusaurus' mobile sidebar state, so picking a page in the
 * docs tree closes it.
 */

const WEBSITE = tigrisConfig.websiteUrl; // https://www.tigrisdata.com

const searchTranslations = {
  button: { buttonText: "Search docs...", buttonAriaLabel: "Search docs" },
};

const BRAND_LOGO = `${WEBSITE}/brand/color-light/Logo.svg`;

function LogoContextMenu({
  x,
  y,
  onClose,
}: {
  x: number;
  y: number;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: y, left: x });

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const rect = menu.getBoundingClientRect();
    const clampedX = Math.min(x, window.innerWidth - rect.width - 8);
    const clampedY = Math.min(y, window.innerHeight - rect.height - 8);
    setPos({ top: Math.max(8, clampedY), left: Math.max(8, clampedX) });
  }, [x, y]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Logo options"
      className={styles.ctx}
      style={{ top: pos.top, left: pos.left }}
    >
      <div className={styles.ctxPreview}>
        <img src={BRAND_LOGO} alt="Tigris logo" width={118} height={48} />
      </div>
      <div className={styles.ctxList}>
        <button
          type="button"
          role="menuitem"
          onClick={async () => {
            try {
              const res = await window.fetch(BRAND_LOGO);
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const svg = await res.text();
              await navigator.clipboard.writeText(svg);
            } catch {
              window.open(BRAND_LOGO, "_blank");
            }
            onClose();
          }}
          className={styles.ctxItem}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="5" width="9" height="9" rx="1.5" />
            <path d="M5 11H3.5A1.5 1.5 0 012 9.5v-7A1.5 1.5 0 013.5 1h7A1.5 1.5 0 0112 2.5V5" />
          </svg>
          Copy logo SVG
        </button>
        <a
          href={`${WEBSITE}/downloads/tigris-logos.zip`}
          download="tigris-logos.zip"
          onClick={onClose}
          role="menuitem"
          className={styles.ctxItem}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 2v8m0 0L5 7m3 3l3-3" />
            <path d="M2 12v1.5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V12" />
          </svg>
          Download logo
        </a>
        <a
          href={`${WEBSITE}/downloads/Tigris-Brand-Kit.zip`}
          download="Tigris-Brand-Kit.zip"
          onClick={onClose}
          role="menuitem"
          className={styles.ctxItem}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="12" height="12" rx="2" />
            <path d="M6 6h4M6 8.5h4M6 11h2" />
          </svg>
          Download brand kit
        </a>
      </div>
    </div>
  );
}

function ChangelogLink({
  className,
  onClick,
}: {
  className: string;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();
  return (
    <Link
      to="/changelog/"
      className={clsx(
        className,
        pathname.startsWith("/docs/changelog") && styles.active,
      )}
      onClick={onClick}
    >
      Changelog
    </Link>
  );
}

function Ctas() {
  return (
    <>
      <a
        href={tigrisConfig.loginUrl}
        className={clsx(styles.btn, styles.btnSecondary)}
      >
        Sign in
      </a>
      <a
        href={tigrisConfig.signUpUrl}
        className={clsx(styles.btn, styles.btnPrimary)}
      >
        Get started
      </a>
    </>
  );
}

export default function Navbar(): ReactNode {
  const [scrolled, setScrolled] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const { pathname } = useLocation();
  const mobileSidebar = useNavbarMobileSidebar();
  const docsTree = useNavbarSecondaryMenu().content;
  const logoSrc = useBaseUrl("/img/tigris-logo.svg");
  const menuOpen = mobileSidebar.shown;
  useLockBodyScroll(menuOpen);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // any navigation closes the sheet (docs-tree clicks already do)
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname && mobileSidebar.shown)
      mobileSidebar.toggle();
    lastPath.current = pathname;
  }, [pathname, mobileSidebar]);

  return (
    <>
      {contextMenu && (
        <LogoContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
        />
      )}
      {/* `navbar` is kept because Docusaurus reads `.navbar` for the TOC
          scroll offset; styles.nav resets infima's navbar styles. */}
      <nav className={clsx("navbar", styles.nav, scrolled && styles.scrolled)}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <a
              href={`${WEBSITE}/`}
              className={styles.logo}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY });
              }}
            >
              <img src={logoSrc} alt="Tigris" width={79} height={32} />
            </a>
            <span className={styles.divider} aria-hidden />
            <Link to="/" className={styles.docsLabel}>
              Docs
            </Link>
          </div>

          <div className={styles.search}>
            <SearchBar translations={searchTranslations} />
          </div>

          <div className={styles.right}>
            <ChangelogLink className={styles.topLink} />
            <NavbarColorModeToggle className={styles.themeToggle} />
            <div className={styles.actions}>
              <Ctas />
            </div>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={mobileSidebar.toggle}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={styles.sheet}>
            {docsTree && (
              <nav
                aria-label="Docs sidebar"
                className={clsx("menu thin-scrollbar", styles.sheetTree)}
              >
                {docsTree}
              </nav>
            )}
            <div className={styles.sheetRow}>
              <ChangelogLink
                className={styles.sheetLink}
                onClick={mobileSidebar.toggle}
              />
              <NavbarColorModeToggle />
            </div>
            <div className={styles.sheetActions}>
              <Ctas />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
