import { JSX } from 'react'

export const PlusIcon = ({
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
    strokeWidth={strokeWidth ? strokeWidth : '1.5'}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
)
