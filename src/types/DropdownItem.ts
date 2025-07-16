import { JSX } from "react"

export interface DropdownItem {
  key: string
  content: JSX.Element
  onClick: () => void
}
