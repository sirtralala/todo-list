import { XMarkIcon } from "../../icons"
import React, { Dispatch, JSX, SetStateAction, useState } from "react"
import {
  buttonClassName,
  buttonClassNamePrimary,
  getDayClassName,
  isInputValid,
  tdClassName,
  trClassName,
} from "../../utilities"
import { DeleteItemNotification } from "../notifications/DeleteItemNotification"
import { TableCell, TableCellEdit } from "./TableCellEdit"
import { TableCellCategoriesEdit } from "./TableCellCategoriesEdit"
import { TodoItem } from "../../types"
import DatePicker from "react-datepicker"
import { CategoriesDropdown, StatusDropdown } from "../dropdowns"

interface TableRowProps {
  displayedItem: TodoItem
  i: number
  uniqueCategories: string[]
  setFilteredItems: Dispatch<SetStateAction<TodoItem[]>>
  editedItems: TodoItem[]
  setEditedItems: Dispatch<SetStateAction<TodoItem[]>>
  setCheckEdit: Dispatch<SetStateAction<boolean>>
  setNotification: Dispatch<SetStateAction<JSX.Element | undefined>>
  setUserEnquiry: (value: React.SetStateAction<JSX.Element | undefined>) => void
  onEditItem: () => void
  onDeleteItems: (itemIds: string[]) => void
  onResetItem: (item: TodoItem) => void
}

export const TableRow = ({
  displayedItem,
  i,
  uniqueCategories,
  setFilteredItems,
  editedItems,
  setEditedItems,
  setCheckEdit,
  setNotification,
  setUserEnquiry,
  onEditItem,
  onDeleteItems,
  onResetItem,
}: TableRowProps) => {
  const editedItem = editedItems.find((e) => e.id === displayedItem.id)
  const [editCategoriesIndex, setEditCategoriesIndex] = useState<number>(-1)

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
            title='Löschen'
            className='hover:text-zinc-600'
            onClick={(e) => {
              e.stopPropagation()
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
                setNotification(
                  <p>Mindestens eine Kategorie muss erhalten bleiben</p>
                )
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
        displayedItem={displayedItem}
        setFilteredItems={setFilteredItems}
        editedItems={editedItems}
        setEditedItems={setEditedItems}
      />
    )

  const renderDatePicker = (displayedItem: TodoItem) => {
    const onDateChange = (date: Date | null) => {
      const currentItem: TodoItem = editedItem || displayedItem
      const newItem: TodoItem = {
        ...currentItem,
        deadline: date!,
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

    return (
      <DatePicker
        selected={(editedItem || displayedItem).deadline}
        onChange={onDateChange}
        customInput={
          <input className='w-24 h-8 -mt-1 px-1 border-none rounded-md' />
        }
        dayClassName={(date) =>
          getDayClassName(
            date,
            new Date((editedItem || displayedItem).deadline)
          )
        }
        fixedHeight
      />
    )
  }

  const renderActionButtons = () => (
    <div className='w-full flex justify-between'>
      <div className='flex flex-nowrap space-x-2'>
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
            className={`w-[104px] ${buttonClassName}`}
            onClick={() => {
              if (displayedItem.categories.length > 8) {
                setNotification(
                  <p>Es können maximal 8 Kategorien pro Todo vergeben werden</p>
                )
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
                      ? "Der Name der Kategorie muss aus mindestens 1 Zeichen bestehen"
                      : "Der Name der Kategorie darf aus maximal 96 Zeichen bestehen"}
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
                    onDeleteItems([displayedItem.id])
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

  const currentItem =
    editedItems.find((edited) => edited.id === displayedItem.id) ||
    displayedItem

  return (
    <tr key={`item-${i}`} className={trClassName}>
      <td className={tdClassName}>
        {renderTableCell(TableCell.TITLE, displayedItem, i)}
      </td>
      <td className={`${tdClassName} pt-4`}>
        <StatusDropdown
          status={editedItem ? editedItem.status : displayedItem.status}
          editedItems={editedItems}
          setEditedItems={setEditedItems}
          item={displayedItem}
          zIndex={`z-${110 - i * 10}`}
        />
      </td>
      <td className={`flex justify-between items-center ${tdClassName}`}>
        {renderTableCell(TableCell.CATEGORY, currentItem, i)}
        <CategoriesDropdown
          uniqueCategories={uniqueCategories}
          setNotification={setNotification}
          item={displayedItem}
          editedItems={editedItems}
          setEditedItems={setEditedItems}
          zIndex={`z-${110 - i * 10}`}
        />
      </td>
      <td className={`${tdClassName} pt-5`}>
        {renderDatePicker(displayedItem)}
      </td>
      <td className={`${tdClassName} pt-4 pr-0 flex space-x-2`}>
        {renderActionButtons()}
      </td>
    </tr>
  )
}
