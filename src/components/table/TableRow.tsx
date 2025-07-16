import { XMarkIcon } from "../../icons"
import React, { Dispatch, JSX, SetStateAction, useState } from "react"
import {
  buttonClassName,
  buttonClassNamePrimary,
  isInputValid,
  tdClassName,
  trClassName,
} from "../../utilities"
import { DeleteItemNotification } from "../notifications/DeleteItemNotification"
import { TableCell, TableCellEdit } from "./TableCellEdit"
import { TableCellCategoriesEdit } from "./TableCellSimilarEdit"
import { TodoItem } from "../../types"
import { Dropdown } from "../Dropdown"

interface TableRowProps {
  displayedItem: TodoItem
  i: number
  setFilteredItems: Dispatch<SetStateAction<TodoItem[]>>
  editedItems: TodoItem[]
  setEditedItems: Dispatch<SetStateAction<TodoItem[]>>
  setCheckEdit: Dispatch<SetStateAction<boolean>>
  setNotification: Dispatch<SetStateAction<JSX.Element | undefined>>
  setUserEnquiry: (value: React.SetStateAction<JSX.Element | undefined>) => void
  onEditItem: () => void
  onDeleteItem: (itemIds: string[]) => void
  onResetItem: (item: TodoItem) => void
}

export const TableRow = ({
  displayedItem,
  i,
  setFilteredItems,
  editedItems,
  setEditedItems,
  setCheckEdit,
  setNotification,
  setUserEnquiry,
  onEditItem,
  onDeleteItem,
  onResetItem,
}: TableRowProps) => {
  const [editCategoriesIndex, setEditCategoriesIndex] = useState<number>(-1)
  const editedItem = editedItems.find((e) => e.id === displayedItem.id)

  const renderEditCategoriesList = (categories: string[]) => (
    <div key='edit-category-container' className='flex flex-wrap'>
      {categories.map((c, i) => (
        <div
          key={`edit-category-item-${c}-${i}`}
          title='edit'
          className='w-fit flex items-start my-1 mr-1 rounded-md border border-gray-500 shadow-sm text-black cursor-pointer'
          onClick={() => setEditCategoriesIndex(i)}
        >
          <p className='px-1 py-0.5'>{c}</p>
          <button
            type='button'
            title='delete'
            className='hover:text-zinc-600'
            onClick={(e) => {
              e.stopPropagation()

              const editedItem = editedItems.find(
                (e) => e.id === displayedItem.id
              )
              const currentItem: TodoItem = editedItem || displayedItem

              if (currentItem.categories.length > 1) {
                const newItem: TodoItem = {
                  ...currentItem,
                  categories: currentItem.categories.filter(
                    (current) => current !== c
                  ),
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
              } else {
                setNotification(<p>"error-at-least-one-category"</p>)
              }
            }}
          >
            <XMarkIcon strokeWidth='1.5' className='h-4 w-4' />
          </button>
        </div>
      ))}
    </div>
  )

  const renderTableCell = (
    cellType: TableCell,
    displayedItem: TodoItem,
    i: number
  ) =>
    editCategoriesIndex >= 0 && cellType === TableCell.CATEGORY ? (
      <TableCellCategoriesEdit
        categoriesIndex={editCategoriesIndex}
        displayedItem={displayedItem}
        setFilteredItems={setFilteredItems}
        editedItems={editedItems}
        setEditedItems={setEditedItems}
        setNotification={setNotification}
      />
    ) : displayedItem.categories && cellType === TableCell.CATEGORY ? (
      renderEditCategoriesList(displayedItem.categories)
    ) : (
      <TableCellEdit
        i={i}
        cellType={cellType}
        displayedItem={displayedItem}
        setFilteredItems={setFilteredItems}
        editedItems={editedItems}
        setEditedItems={setEditedItems}
      />
    )

  const renderActionButtons = () => (
    <div className='w-full flex justify-between mr-4'>
      <div className='flex flex-nowrap space-x-2 mr-2'>
        {editedItem || editCategoriesIndex > 0 ? (
          <button
            className={buttonClassName}
            onClick={() => {
              setEditCategoriesIndex(-1)
              setNotification(undefined)
              if (editedItem) {
                onResetItem(editedItem)
              }
            }}
          >
            Zurücksetzen
          </button>
        ) : (
          <button
            className={buttonClassName}
            onClick={() => {
              if (displayedItem.categories.length >= 8) {
                setNotification(<p>error-too-many-categories</p>)
                return
              }
              setEditCategoriesIndex(displayedItem.categories.length)
              setEditedItems((prevItems) =>
                prevItems.length
                  ? prevItems.map((p) => {
                      if (p.id === displayedItem.id) {
                        return {
                          ...displayedItem,
                          categories: [...displayedItem.categories, ""],
                        }
                      }
                      return p
                    })
                  : [
                      {
                        ...displayedItem,
                        categories: [...displayedItem.categories, ""],
                      },
                    ]
              )
            }}
          >
            Hinzufügen
          </button>
        )}

        {editCategoriesIndex >= 0 ? (
          <button
            className={buttonClassNamePrimary}
            onClick={() => {
              const currentItem: TodoItem = editedItem || displayedItem
              const currentItemLength =
                currentItem.categories[editCategoriesIndex]?.length

              if (currentItemLength > 0 && currentItemLength <= 96) {
                setCheckEdit(false)
                setNotification(undefined)
                setEditCategoriesIndex(-1)
                onEditItem()
              } else {
                setNotification(
                  <p>
                    {!currentItemLength
                      ? "error-categories-items-length"
                      : "error-categories-items-too-long"}
                  </p>
                )
              }
            }}
          >
            Speichern
          </button>
        ) : editedItem ? (
          <button
            className={buttonClassNamePrimary}
            onClick={() => {
              const invalidEditedItem = editedItems.find(
                (e) =>
                  !isInputValid({
                    item: e,
                  })
              )
              if (!invalidEditedItem) {
                setCheckEdit(false)
                setNotification(undefined)
                onEditItem()
              } else {
                setCheckEdit(true)
              }
            }}
          >
            Speichern
          </button>
        ) : (
          <button
            className={buttonClassName}
            onClick={() => {
              setUserEnquiry(
                <DeleteItemNotification
                  onClick={() => {
                    onDeleteItem([displayedItem.id])
                    setUserEnquiry(undefined)
                  }}
                  setUserEnquiry={setUserEnquiry}
                />
              )
            }}
          >
            Löschen
          </button>
        )}
      </div>
    </div>
  )

  return (
    <tr key={`item-${i}`} className={trClassName}>
      <td className={tdClassName}>
        {renderTableCell(TableCell.TITLE, displayedItem, i)}
      </td>
      <td className={`${tdClassName} pt-4`}>
        <Dropdown
          status={editedItem ? editedItem.status : displayedItem.status}
          editedItems={editedItems}
          setEditedItems={setEditedItems}
          item={displayedItem}
          zIndex={`z-${110 - i * 10}`}
        />
      </td>
      <td className={`${tdClassName} mt-2`}>
        {renderTableCell(TableCell.CATEGORY, displayedItem, i)}
      </td>
      <td className={tdClassName}>
        {renderTableCell(TableCell.DEADLINE, displayedItem, i)}
      </td>
      <td className={`${tdClassName} pt-4 pr-0 flex space-x-2`}>
        {renderActionButtons()}
      </td>
    </tr>
  )
}
