import React, { useState } from "react";
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
      {children[active]}
    </div>
  );
}
