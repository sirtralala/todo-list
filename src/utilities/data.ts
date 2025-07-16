import { TodoItem } from "../types"

interface ValidInputProps {
  item: TodoItem
}

export const isInputValid = ({ item }: ValidInputProps): boolean => {
  if (!item.title.trim().length) {
    return false
  }

  return (
    item.title.length <= 96 &&
    (item.categories.length < 8 || item.categories.length === 8) &&
    !item.categories.find((s) => s.trim().length > 96)
  )
}

export const areArraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((el, i) => el === b[i])
