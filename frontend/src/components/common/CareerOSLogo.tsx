import React from 'react'

interface CareerOSLogoProps {
  size?: number | string
  className?: string
}

export const CareerOSLogo: React.FC<CareerOSLogoProps> = ({
  size = 32,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CareerOS Logo"
    >
      <defs>
        <linearGradient id="cos-logo-grad" x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="cos-logo-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0e131f" />
          <stop offset="100%" stopColor="#05070c" />
        </linearGradient>
      </defs>

      {/* Container Base */}
      <rect width="32" height="32" rx="8" fill="url(#cos-logo-bg)" />
      <rect width="31" height="31" x="0.5" y="0.5" rx="7.5" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

      {/* Geometric C Loop */}
      <path
        d="M21.5 11.5C19.8 8.2 16.2 6.5 12.5 6.5C7.5 6.5 3.5 10.7 3.5 16C3.5 21.3 7.5 25.5 12.5 25.5C16.5 25.5 20.2 23.5 21.8 19.8"
        stroke="url(#cos-logo-grad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Dynamic Growth Arrow */}
      <path
        d="M19.5 6.5H27.5V14.5"
        stroke="url(#cos-logo-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.5 6.5L15 19"
        stroke="url(#cos-logo-grad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
