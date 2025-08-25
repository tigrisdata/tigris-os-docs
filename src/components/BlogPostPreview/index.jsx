import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

/**
 * BlogPostPreview Component
 *
 * A reusable component that displays a preview of a blog post with
 * an image, title, description, and call-to-action button.
 *
 * @param {string} href - The URL to the blog post
 * @param {string} title - The title of the blog post
 * @param {string} description - A brief description or excerpt from the post
 * @param {string} imageSrc - The source URL for the preview image
 * @param {string} imageAlt - Alt text for the preview image
 * @param {string} buttonText - Text for the CTA button (default: "Read More")
 * @param {string} author - Optional author name
 * @param {string} date - Optional publication date
 */
const BlogPostPreview = ({
  href,
  title,
  description,
  imageSrc,
  imageAlt,
  buttonText = "Read More",
  author,
  date,
}) => {
  return (
    <div className={styles.previewCard}>
      <a
        href={href}
        className={styles.imageLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.imageContainer}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className={styles.image}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/800x450/0f172a/94a3b8?text=Image+Not+Found";
            }}
          />
        </div>
      </a>

      <div className={styles.content}>
        <a
          href={href}
          className={styles.titleLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className={styles.title}>{title}</h3>
        </a>

        {(author || date) && (
          <div className={styles.metadata}>
            {author && <span className={styles.author}>{author}</span>}
            {author && date && <span className={styles.separator}>•</span>}
            {date && <span className={styles.date}>{date}</span>}
          </div>
        )}

        <p className={styles.description}>{description}</p>

        <a
          href={href}
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{buttonText}</span>
          <svg
            className={styles.buttonIcon}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

BlogPostPreview.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
};

export default BlogPostPreview;
