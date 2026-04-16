import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

export default function PlatformToggle({ options, children }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className={styles.toggle}>
        {options.map((label, i) => (
          <button
            key={label}
            className={`${styles.option} ${i === active ? styles.active : ""}`}
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {React.Children.toArray(children)[active]}
    </div>
  );
}

PlatformToggle.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};
