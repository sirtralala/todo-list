import { Status, TodoItem } from "./../../types"
import {
  areArraysEqual,
  buttonClassName,
  isInputValid,
  tdClassName,
} from "../../utilities"
import { Dispatch, JSX, SetStateAction } from "react"
import { TableCell } from "./TableCellEdit"
import { PlusIcon } from "../../icons"
import { Dropdown } from "../Dropdown"

interface AddItemRowProps {
  items: TodoItem[]
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  category: string
  setCategory: Dispatch<SetStateAction<string>>
  status: Status
  setStatus: Dispatch<SetStateAction<Status>>
  deadline: string
  setDeadline: Dispatch<SetStateAction<string>>
  categories: string[]
  setCategories: Dispatch<SetStateAction<string[]>>
  setCheckInput: Dispatch<SetStateAction<boolean>>
  setNotification: Dispatch<SetStateAction<JSX.Element | undefined>>
  onAddItem: (item: TodoItem[]) => void
}

export const AddItemRow = ({
  items,
  title,
  setTitle,
  category,
  setCategory,
  categories,
  setCategories,
  status,
  setStatus,
  deadline,
  setDeadline,
  setCheckInput,
  setNotification,
  onAddItem,
}: AddItemRowProps) => {
  const isNewItemADuplidate = (newItem: TodoItem) =>
    !!items.find(
      (Item) =>
        Item.title.toLowerCase() === newItem.title.toLowerCase() &&
        areArraysEqual(Item.categories, newItem.categories)
    )

  const renderTableCellInput = (
    cellType: TableCell,
    value: string,
    set: (value: string) => void
  ) => {
    const isCategoriesInput = cellType === TableCell.CATEGORY

    return (
      <div className='flex justify-end h-8'>
        <input
          type='text'
          name='table-cell-add'
          className={`w-full py-0 ${
            isCategoriesInput ? "pl-1 pr-7" : "px-1"
          } border border-gray-500 rounded-md focus:border-white`}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
        {isCategoriesInput ? (
          <button
            type='button'
            className='relative right-6 mr-0.5'
            onClick={() => {
              if (category.trim().length) {
                setCategories((prev) => [...prev, value])
                setCategory("")
                setNotification(undefined)
              } else {
                setNotification(<p>no-category</p>)
              }
            }}
          >
            <PlusIcon className='h-5 w-5 text-black stroke-[1.5] border border-black rounded-full hover:text-gray-500 hover:border-gray-500' />
          </button>
        ) : null}
      </div>
    )
  }

  const renderAddButton = () => (
    <button
      name='Hinzufügen'
      className={buttonClassName}
      onClick={() => {
        const newItem: TodoItem = {
          id: `${title}--${Date.now().toString()}`,
          title,
          categories:
            categories?.length && category.length
              ? [...categories, category]
              : categories?.length
              ? categories
              : [category],
          status,
          deadline,
        }
        if (
          isInputValid({
            item: newItem,
          })
        ) {
          setTitle("")
          setCategory("")
          setDeadline("")
          setStatus(Status.NEW)
          setCheckInput(false)

          if (isNewItemADuplidate(newItem)) {
            setNotification(<p>error-new-item-exists-already</p>)
          } else {
            setNotification(undefined)
            onAddItem([newItem])
          }
        } else {
          setCheckInput(true)
        }
      }}
    >
      Hinzufügen
    </button>
  )

  return (
    <tr
      key='add-item-row'
      className={`h-14 align-top ${
        categories?.length
          ? "shadow-[-1px_-1px_3px_-1px_rgba(0,0,0,0.1),1px_-1px_3px_-1px_rgba(0,0,0,0.1)]"
          : "shadow-md"
      }`}
    >
      <td className={tdClassName}>
        {renderTableCellInput(TableCell.TITLE, title, setTitle)}
      </td>
      <td className={tdClassName}>
        {/* <MultiSelectDropdown
          currentCategories={categories}
          setCategories={setCategories}
          zIndex='z-2000'
        /> */}
        <Dropdown status={status} setStatus={setStatus} />
      </td>
      <td className={tdClassName}>
        {renderTableCellInput(TableCell.CATEGORY, category, setCategory)}
      </td>
      <td className={tdClassName}>
        {renderTableCellInput(TableCell.DEADLINE, deadline, setDeadline)}
      </td>
      <td className={`${tdClassName} w-full flex justify-between`}>
        <div className='w-full flex justify-between h-8'>
          {renderAddButton()}
        </div>
      </td>
    </tr>
  )
}
