import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';

// --- Helper function for tag colors ---
// This is used by subcategory items only.
const getTagColorClasses = (color) => {
  switch (color) {
    case 'cyan':
      return `${styles.tag} ${styles.tagCyan}`;
    case 'green':
      return `${styles.tag} ${styles.tagGreen}`;
    case 'red':
      return `${styles.tag} ${styles.tagRed}`;
    case 'yellow':
      return `${styles.tag} ${styles.tagYellow}`;
    case 'magenta':
      return `${styles.tag} ${styles.tagMagenta}`;
    case 'blue':
      return `${styles.tag} ${styles.tagBlue}`;
    case 'purple':
      return `${styles.tag} ${styles.tagPurple}`;
    case 'orange':
      return `${styles.tag} ${styles.tagOrange}`;
    default:
      return `${styles.tag} ${styles.tagDefault}`;
  }
};

// --- Subcategory Item Component ---
// This component renders individual items within a subcategory.
const SubcategoryItem = ({ title, description, tag }) => (
  <div className={styles.subcategoryItem}>
    <div className={styles.subcategoryItemHeader}>
      {tag && (
        <span className={getTagColorClasses(tag.color)}>
          {tag.label}
        </span>
      )}
      <h4 className={styles.subcategoryItemTitle}>{title}</h4>
    </div>
    {description && (
      <p className={styles.subcategoryItemDescription}>{description}</p>
    )}
  </div>
);

SubcategoryItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  tag: PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
};

// --- Subcategory Component ---
// This component renders a collapsible subcategory with its items.
const Subcategory = ({ title, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.subcategory}>
      <div className={styles.subcategoryHeader} onClick={toggleExpanded}>
        <h3 className={styles.subcategoryTitle}>
          {title} ({items.length})
        </h3>
        <button className={styles.expandButton} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          <svg
            className={`${styles.expandIcon} ${isExpanded ? styles.expandIconRotated : ''}`}
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

      {isExpanded && (
        <div className={styles.subcategoryContent}>
          {items.map((item, index) => (
            <SubcategoryItem key={index} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

Subcategory.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      tag: PropTypes.shape({
        label: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
};


// --- Main Changelog Item Component ---
// This component renders a single entry in the timeline.
export const ChangelogItem = ({ date, title, content, subcategories, image, footerLink, isLast }) => {
  return (
    <div className={styles.timelineItem}>
      {/* The vertical line connecting the timeline dots */}
      {!isLast && (
        <div className={styles.timelineConnector}></div>
      )}

      {/* The colored dot on the timeline */}
      <div className={styles.timelineDot}>
        <div className={styles.timelineDotCircle}></div>
      </div>

      {/* Date on the left */}
      <div className={styles.dateContainer}>
        <p className={styles.dateText}>{date}</p>
      </div>

      {/* Content on the right */}
      <div className={styles.content}>
        <div className={styles.dateMobile}>{date}</div>

        {/* Header area */}
        <div className={styles.header}>
          <h2 className={styles.entryTitle}>{title}</h2>
        </div>

        {/* Content */}
        <div className={styles.contentArea}>
          {content && (
            <div className={styles.entryContent}>
              {content}
            </div>
          )}

          {image && (
            <div className={styles.imageContainer}>
              <img
                src={image.src}
                alt={image.alt}
                className={styles.image}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x450/0f172a/94a3b8?text=Image+Not+Found'; }}
              />
            </div>
          )}

          {/* Subcategories */}
          {subcategories && subcategories.length > 0 && (
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
          description: PropTypes.string,
          tag: PropTypes.shape({
            label: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
          }),
        })
      ).isRequired,
    })
  ),
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  }),
  footerLink: PropTypes.shape({
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  isLast: PropTypes.bool.isRequired,
};


// --- Main App Component ---
// This is the main component that renders the entire page and timeline.
export default function Timeline({ changelogData }) {
  return (
    <div className={styles.timeline}>
      {changelogData.map((item, index) => (
        <ChangelogItem
          key={index}
          {...item}
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
    })
  ).isRequired,
};
