import * as React from "react";

export default function GreenStar(props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.4025 10.5689L24 12L21.4025 13.4311C18.0372 15.2706 15.2706 18.0372 13.4311 21.4025L12 24L10.5689 21.4025C8.72944 18.0372 5.96277 15.2706 2.59748 13.4311L0 12L2.59748 10.5689C5.96277 8.72944 8.72944 5.96279 10.5689 2.5975L12 0L13.4311 2.5975C15.2706 5.96279 18.0372 8.72944 21.4025 10.5689Z"
        fill="url(#paint0_linear_692_2851)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_692_2851"
          x1="-6.93578"
          y1="38.2564"
          x2="36.5964"
          y2="34.6199"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.243719" stopColor="#39D5A9" />
          <stop offset="0.897943" stopColor="#39D5A9" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
