import { useEffect, useState } from "react"
import { TodoItem } from "../types"

interface PaginationProps {
  items: TodoItem[]
  currentPage: number
  rowsPerPage: number
  sortType: string
}

export const usePagination = ({
  items,
  currentPage,
  rowsPerPage,
  sortType,
}: PaginationProps) => {
  const [tablePages, setTablePages] = useState<number>(1)
  const [displayedItems, setDisplayedItems] = useState<TodoItem[]>([])

  useEffect(() => {
    if (items) {
      // set number of current table pages
      setTablePages(Math.ceil(items.length / rowsPerPage))

      // slice current selection from items
      setDisplayedItems(
        items.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      )
    }
  }, [items, currentPage, rowsPerPage, sortType])

  return { displayedItems, tablePages }
}
