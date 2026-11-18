import React, { useState } from "react";
import PropTypes from "prop-types";
import BlogPostPreview from "@site/src/components/BlogPostPreview";
import styles from "./styles.module.css";

// --- Helper function to truncate month names ---
// This function truncates month names to 3 characters (e.g., "November 15, 2025" becomes "Nov 15, 2025")
const formatDate = (dateString) => {
  // Input validation
  if (!dateString || typeof dateString !== "string") {
    return dateString;
  }

  // Parse the date string
  const parts = dateString.split(" ");
  if (parts.length >= 2 && parts[0].length > 3) {
    // Truncate the month name to 3 characters
    const month = parts[0].substring(0, 3);
    return `${month} ${parts.slice(1).join(" ")}`;
  }
  return dateString;
};

// --- Helpers for the entry heading ---
// Entries are releases, so the heading names the release rather than its
// headline feature: "September 30, 2026" becomes "September 2026 release".
// When a month has more than one entry, the full date keeps them distinct.
const monthOf = (dateString) => {
  const parts = (dateString || "").split(" ");
  return parts.length === 3 ? `${parts[0]} ${parts[2]}` : dateString;
};

const releaseHeading = (dateString, monthCounts) => {
  const month = monthOf(dateString);
  return `${monthCounts[month] > 1 ? dateString : month} release`;
};

// Older entries embed a BlogPostPreview tile in their content. That tile
// already sets the headline feature apart, so those entries skip the card
// border instead of nesting one card inside another.
const hasBlogPostPreview = (content) =>
  React.Children.toArray(content?.props?.children).some(
    (child) => child.type === BlogPostPreview,
  );

const countChanges = (subcategories) =>
  (subcategories || []).reduce((n, s) => n + (s.items || []).length, 0);

// --- Helper function for tag colors ---
// This is used by subcategory items only.
const getTagColorClasses = (color) => {
  switch (color) {
    case "cyan":
      return `${styles.tag} ${styles.tagCyan}`;
    case "green":
      return `${styles.tag} ${styles.tagGreen}`;
    case "red":
      return `${styles.tag} ${styles.tagRed}`;
    case "yellow":
      return `${styles.tag} ${styles.tagYellow}`;
    case "magenta":
      return `${styles.tag} ${styles.tagMagenta}`;
    case "blue":
      return `${styles.tag} ${styles.tagBlue}`;
    case "purple":
      return `${styles.tag} ${styles.tagPurple}`;
    case "orange":
      return `${styles.tag} ${styles.tagOrange}`;
    default:
      return `${styles.tag} ${styles.tagDefault}`;
  }
};

// --- Subcategory Item Component ---
// This component renders individual items within a subcategory.
// Each item can be collapsed; `defaultOpen` controls initial state.
const SubcategoryItem = ({ title, description, tag, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen((v) => !v);

  return (
    <div className={styles.subcategoryItem}>
      <div className={styles.subcategoryItemHeader}>
        {tag && (
          <span className={getTagColorClasses(tag.color)}>{tag.label}</span>
        )}

        <button
          type="button"
          className={styles.subcategoryItemTitleButton}
          onClick={toggle}
          aria-expanded={isOpen}
        >
          <h4 className={styles.subcategoryItemTitle}>{title}</h4>
          <svg
            className={`${styles.expandIcon} ${isOpen ? styles.expandIconRotated : ""}`}
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isOpen && description && (
        <div className={styles.subcategoryItemDescription}>{description}</div>
      )}
    </div>
  );
};

SubcategoryItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  tag: PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
  defaultOpen: PropTypes.bool,
};

// --- Subcategory Component ---
// This component renders a subcategory and always shows its items.
const Subcategory = ({ title, items }) => (
  <div className={styles.subcategory}>
    <div className={styles.subcategoryHeader}>
      <h3 className={styles.subcategoryTitle}>
        {title} ({items.length})
      </h3>
    </div>

    <div className={styles.subcategoryContent}>
      {items.map((item, index) => (
        <SubcategoryItem key={index} {...item} />
      ))}
    </div>
  </div>
);

Subcategory.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.node,
      tag: PropTypes.shape({
        label: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      }),
      defaultOpen: PropTypes.bool,
    }),
  ).isRequired,
};

// --- Main Changelog Item Component ---
// This component renders a single entry in the timeline.
export const ChangelogItem = ({
  date,
  title,
  content,
  subcategories,
  image,
  footerLink,
  heading,
  isLast,
}) => {
  const changeCount = countChanges(subcategories);
  const hasSubcategories = subcategories && subcategories.length > 0;

  return (
    <div className={styles.timelineItem}>
      {/* The vertical line connecting the timeline dots */}
      {!isLast && <div className={styles.timelineConnector}></div>}

      {/* The colored dot on the timeline */}
      <div className={styles.timelineDot}>
        <div className={styles.timelineDotCircle}></div>
      </div>

      {/* Date on the left */}
      <div className={styles.dateContainer}>
        <p className={styles.dateText}>{formatDate(date)}</p>
      </div>

      {/* Content on the right */}
      <div className={styles.content}>
        <div className={styles.dateMobile}>{formatDate(date)}</div>

        {/* Header area: the release, not its headline feature */}
        <div className={styles.itemHeader}>
          <h2 className={styles.entryTitle}>{heading || date}</h2>
        </div>
        {changeCount > 0 && (
          <div className={styles.changeCount}>
            {changeCount} {changeCount === 1 ? "change" : "changes"}
          </div>
        )}

        {/* Featured card: the headline feature of this release */}
        <div
          className={
            hasBlogPostPreview(content) ? styles.featured : styles.featuredCard
          }
        >
          <span className={styles.featuredLabel}>Featured</span>
          <h3 className={styles.featuredTitle}>{title}</h3>
          {content && (
            <div className={`${styles.entryContent} ${styles.featuredBody}`}>
              {content}
            </div>
          )}
        </div>

        {hasSubcategories && (
          <div className={styles.sectionLabel}>Also in this release</div>
        )}

        {/* Content */}
        <div className={styles.contentArea}>
          {image && (
            <div className={styles.imageContainer}>
              {image.href !== undefined ? (
                <a href={image.href}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={styles.image}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/800x450/0f172a/94a3b8?text=Image+Not+Found";
                    }}
                  />
                </a>
              ) : footerLink ? (
                <a href={footerLink.href} className={styles.imageLink}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={styles.image}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/800x450/0f172a/94a3b8?text=Image+Not+Found";
                    }}
                  />
                </a>
              ) : (
                <img
                  src={image.src}
                  alt={image.alt}
                  className={styles.image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/800x450/0f172a/94a3b8?text=Image+Not+Found";
                  }}
                />
              )}
            </div>
          )}

          {/* Subcategories */}
          {hasSubcategories && (
            <div className={styles.subcategoriesContainer}>
              {subcategories.map((subcategory, index) => (
                <Subcategory key={index} {...subcategory} />
              ))}
            </div>
          )}

          {footerLink && (
            <div className={styles.footerLink}>
              <a href={footerLink.href} className={styles.footerLinkAnchor}>
                {footerLink.text}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ChangelogItem.propTypes = {
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node,
  subcategories: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          description: PropTypes.node,
          tag: PropTypes.shape({
            label: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
          }),
        }),
      ).isRequired,
    }),
  ),
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    href: PropTypes.string,
  }),
  footerLink: PropTypes.shape({
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  heading: PropTypes.string,
  isLast: PropTypes.bool.isRequired,
};

// --- Main App Component ---
// This is the main component that renders the entire page and timeline.
export default function Timeline({ changelogData }) {
  const monthCounts = changelogData.reduce((counts, item) => {
    const month = monthOf(item.date);
    counts[month] = (counts[month] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className={styles.timeline}>
      {changelogData.map((item, index) => (
        <ChangelogItem
          key={index}
          {...item}
          heading={releaseHeading(item.date, monthCounts)}
          isLast={index === changelogData.length - 1}
        />
      ))}
    </div>
  );
}

Timeline.propTypes = {
  changelogData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.node,
      subcategories: PropTypes.array,
      image: PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
      }),
      footerLink: PropTypes.shape({
        href: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      }),
    }),
  ).isRequired,
};
