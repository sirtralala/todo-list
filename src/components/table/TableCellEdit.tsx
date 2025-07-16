import * as React from "react"
import { TodoItem } from "../../types"

// eslint-disable-next-line react-refresh/only-export-components
export enum TableCell {
  TITLE = "title",
  STATUS = "status",
  CATEGORY = "category",
  DEADLINE = "deadline",
}

const onTableCellInput = (
  cellType: TableCell,
  displayedItem: TodoItem,
  newValue: string,
  editedItems: TodoItem[],
  setEditedItems: React.Dispatch<React.SetStateAction<TodoItem[]>>,
  setFilteredItems: React.Dispatch<React.SetStateAction<TodoItem[]>>
) => {
  const editedItem = editedItems.find((e) => e.id === displayedItem.id)
  const currentItem = editedItem || displayedItem
  const newItem: TodoItem = {
    ...currentItem,
    title: cellType === TableCell.TITLE ? newValue : currentItem.title,
    deadline: cellType === TableCell.DEADLINE ? newValue : currentItem.deadline,
  }

  if (!editedItem) {
    setEditedItems((prevItems) => [...prevItems, newItem])
  } else {
    setEditedItems((prevItems) =>
      prevItems.map((p) => {
        if (p.id === newItem.id) {
          return newItem
        }
        return p
      })
    )
  }

  setFilteredItems((prevItems) =>
    prevItems.map((p) => {
      if (p.id === newItem.id) {
        return newItem
      }
      return p
    })
  )
}

export interface TableCellEditProps {
  i: number
  cellType: TableCell
  displayedItem: TodoItem
  setFilteredItems: React.Dispatch<React.SetStateAction<TodoItem[]>>
  editedItems: TodoItem[]
  setEditedItems: React.Dispatch<React.SetStateAction<TodoItem[]>>
}

export const TableCellEdit = ({
  cellType,
  displayedItem,
  setFilteredItems,
  editedItems,
  setEditedItems,
}: TableCellEditProps) => {
  // Using displayedItem's value as the input value leads to the cursor jumping to the end after an input in the middle of the text
  // This is fixed by using the updated editedItem value
  const editedItem = editedItems.find((p) => p.id === displayedItem.id)

  return (
    <input
      type='text'
      name='table-cell-edit'
      className='w-full h-8 py-0 px-1 mt-1 border-none rounded-md'
      value={
        cellType === TableCell.TITLE
          ? editedItem?.title || displayedItem.title
          : editedItem?.deadline || displayedItem.deadline
      }
      onChange={(e) =>
        onTableCellInput(
          cellType,
          displayedItem,
          e.target.value,
          editedItems,
          setEditedItems,
          setFilteredItems
        )
      }
    />
  )
}
