import * as React from "react";

export default function YellowStar(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.2683 7.04592L16 8L14.2683 8.95408C12.0248 10.1804 10.1804 12.0248 8.95409 14.2683L8 16L7.04591 14.2683C5.81963 12.0248 3.97518 10.1804 1.73165 8.95408L0 8L1.73165 7.04592C3.97518 5.81963 5.81963 3.97519 7.04591 1.73167L8 0L8.95409 1.73167C10.1804 3.97519 12.0248 5.81963 14.2683 7.04592Z"
        fill="url(#paint0_linear_1958_10064)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1958_10064"
          x1="-0.0644776"
          y1="8"
          x2="16.5099"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.07" stopColor="#F9BB08" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
}
