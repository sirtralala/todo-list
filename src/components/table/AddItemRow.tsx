import { Status, TodoItem } from "./../../types"
import {
  areArraysEqual,
  buttonClassName,
  isInputValid,
  tdClassName,
} from "../../utilities"
import { Dispatch, JSX, ReactElement, SetStateAction } from "react"
import { TableCell } from "./TableCellEdit"
import { PlusIcon } from "../../icons"
import { CategoriesDropdown, StatusDropdown } from "../dropdowns"
import DatePicker from "react-datepicker"

interface AddItemRowProps {
  items: TodoItem[]
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  category: string
  setCategory: Dispatch<SetStateAction<string>>
  categories: string[]
  setCategories: Dispatch<SetStateAction<string[]>>
  uniqueCategories: string[]
  setUniqueCategories: Dispatch<SetStateAction<string[]>>
  status: Status
  setStatus: Dispatch<SetStateAction<Status>>
  deadline: Date | null
  setDeadline: Dispatch<SetStateAction<Date | null>>
  datePicker: ReactElement<DatePicker>
  setCheckInput: Dispatch<SetStateAction<boolean>>
  setNotification: Dispatch<SetStateAction<JSX.Element | undefined>>
  onAddItem: (item: TodoItem) => void
}

export const AddItemRow = ({
  items,
  title,
  setTitle,
  category,
  setCategory,
  categories,
  setCategories,
  uniqueCategories,
  setUniqueCategories,
  status,
  setStatus,
  deadline,
  setDeadline,
  datePicker,
  setCheckInput,
  setNotification,
  onAddItem,
}: AddItemRowProps) => {
  const isNewItemADuplidate = (newItem: TodoItem) =>
    !!items.find(
      (item) =>
        item.title.toLowerCase() === newItem.title.toLowerCase() &&
        areArraysEqual(item.categories, newItem.categories)
    )

  const renderTableCellInput = (
    cellType: TableCell,
    value: string,
    set: (value: string) => void
  ) => {
    const isCategoriesInput = cellType === TableCell.CATEGORY

    return (
      <div className='h-8 flex justify-end'>
        <input
          type='text'
          name='table-cell-add'
          className={`w-full py-0 ${
            isCategoriesInput ? "pl-1 pr-7" : "px-1"
          } border border-gray-500 rounded-md outline-none`}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
        {isCategoriesInput ? (
          <button
            type='button'
            className='relative right-6 mr-0.5'
            onClick={() => {
              if (
                uniqueCategories.find(
                  (u) => u.toLowerCase() === category.toLowerCase()
                )
              ) {
                setNotification(<p>Diese Kategorie existiert bereits</p>)
                return
              }
              if (!category.trim().length) {
                setNotification(<p>Bitte die Kategorie benennen</p>)
                return
              }

              setCategories((prev) => [...prev, value])
              if (isCategoriesInput) {
                setUniqueCategories((prev) =>
                  prev.includes(value) ? prev : [...prev, value]
                )
              }
              setCategory("")
              setNotification(undefined)
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
      type='button'
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
              : category.length
              ? [category]
              : [],
          status,
          deadline: deadline!,
        }
        if (
          isInputValid({
            item: newItem,
          })
        ) {
          setTitle("")
          setCategory("")
          setDeadline(new Date())
          setStatus(Status.NEW)
          setCheckInput(false)

          if (isNewItemADuplidate(newItem)) {
            setNotification(<p>Dieses Todo existiert bereits</p>)
          } else {
            setNotification(undefined)
            onAddItem(newItem)
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
        <StatusDropdown status={status} setStatus={setStatus} />
      </td>
      <td className={`flex ${tdClassName}`}>
        {renderTableCellInput(TableCell.CATEGORY, category, setCategory)}
        {uniqueCategories.length ? (
          <CategoriesDropdown
            setCategory={setCategory}
            categories={categories}
            setCategories={setCategories}
            uniqueCategories={uniqueCategories}
            setNotification={setNotification}
          />
        ) : null}
      </td>
      <td className={tdClassName}>{datePicker}</td>
      <td className={`${tdClassName} w-full flex justify-between`}>
        <div className='w-full flex justify-between h-8'>
          {renderAddButton()}
        </div>
      </td>
    </tr>
  )
}
