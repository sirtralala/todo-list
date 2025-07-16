import * as React from "react"
import { JSX } from "react"
import { TodoItem } from "../../types"

const onTableCellInput = (
  categoriesIndex: number,
  displayedItem: TodoItem,
  newValue: string,
  editedItems: TodoItem[],
  setEditedItems: React.Dispatch<React.SetStateAction<TodoItem[]>>,
  setFilteredItems: React.Dispatch<React.SetStateAction<TodoItem[]>>,
  setNotification: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>
) => {
  const editedItem = editedItems.find((e) => e.id === displayedItem.id)
  const currentItem = editedItem || displayedItem
  const newItem: TodoItem = {
    id: currentItem.id,
    title: currentItem.title,
    categories: currentItem.categories.map((c, i) =>
      i === categoriesIndex ? newValue : c
    ),
    status: currentItem.status,
    deadline: currentItem.deadline,
  }

  if (!editedItem) {
    // add newly edited item
    setEditedItems((prevItems) => [...prevItems, newItem])
  } else if (categoriesIndex === currentItem.categories.length) {
    // add new category of an existing item
    setEditedItems((prevItems) =>
      prevItems.map((p) => {
        if (p.id === newItem.id) {
          return { ...newItem, categories: [...newItem.categories, newValue] }
        }
        return p
      })
    )
  } else {
    // updated existing edited item
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
  setNotification(undefined)
}

export interface TableCellCategoriesEditProps {
  categoriesIndex: number
  displayedItem: TodoItem
  setFilteredItems: React.Dispatch<React.SetStateAction<TodoItem[]>>
  editedItems: TodoItem[]
  setEditedItems: React.Dispatch<React.SetStateAction<TodoItem[]>>
  setNotification: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>
}

export const TableCellCategoriesEdit = ({
  categoriesIndex,
  displayedItem,
  setFilteredItems,
  editedItems,
  setEditedItems,
  setNotification,
}: TableCellCategoriesEditProps) => {
  // Using displayedItem's value as the input value leads to the cursor jumping to the end after an input in the middle of the text
  // This is fixed by using the updated editedItem value
  const editedItem = editedItems.find((e) => e.id === displayedItem.id)
  const value =
    editedItem?.categories?.find((_c, i) => i === categoriesIndex) ||
    displayedItem.categories?.find((_c, i) => i === categoriesIndex) ||
    ""
  return (
    <input
      type='text'
      name='table-cell-categories-edit'
      className='w-full h-8 py-0 px-1 mt-1 border-none rounded-md'
      value={value}
      autoFocus
      onChange={(e) =>
        onTableCellInput(
          categoriesIndex,
          displayedItem,
          e.target.value,
          editedItems,
          setEditedItems,
          setFilteredItems,
          setNotification
        )
      }
    />
  )
}
