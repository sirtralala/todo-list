import { JSX } from 'react'

export const XMarkIcon = ({
  className,
  strokeWidth,
}: {
  className: string
  strokeWidth?: string
}): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth ? strokeWidth : '1'}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)
