import { JSX } from 'react'

export const MinusIcon = ({
  className,
  strokeWidth,
}: {
  className: string
  strokeWidth?: string
}): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth ? strokeWidth : '2'}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
  </svg>
)
