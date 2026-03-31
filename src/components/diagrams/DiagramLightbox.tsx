import React, { useState, useCallback, useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function DiagramLightbox({ children }: Props) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="diagram-lightbox-trigger">
        {children}
        <button
          className="diagram-lightbox-btn"
          onClick={handleOpen}
          aria-label="Expand diagram"
          title="Expand diagram"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="diagram-lightbox-overlay" onClick={handleClose}>
          <div
            className="diagram-lightbox-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="diagram-lightbox-close"
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
            <div className="diagram-lightbox-content">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
