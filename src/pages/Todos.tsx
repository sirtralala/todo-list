import { usePagination } from "../hooks/usePagination"
import { Status, TodoItem } from "../types"
import { Table, TableHead, TableSearchInput } from "../components/table"
import { XMarkIcon } from "../icons"
import * as React from "react"
import { JSX, useEffect, useState } from "react"
import { DeleteTableItemsButton } from "../components/buttons/DeleteTableItemsButton"
import { AddItemRow } from "../components/table/AddItemRow"
import { TableRow } from "../components/table/TableRow"
import {
  enquiryContainerClassName,
  getDayClassName,
  isInputValid,
  notificationClassName,
} from "../utilities"
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker"
import { de } from "date-fns/locale/de"
import "react-datepicker/dist/react-datepicker.css"
import { DateFilter } from "../components/table/DateFilter"

export const Todos = () => {
  const maxWidth = "max-w-5xl"

  registerLocale("de", de)
  setDefaultLocale("de")

  const local = localStorage.getItem("items")
  const data: TodoItem[] = local ? JSON.parse(local) : []
  const uniqueCats = data
    .flatMap((d) => d.categories)
    .filter((cat, i, arr) => arr.indexOf(cat) === i)

  const [items, setItems] = useState<TodoItem[]>(data)
  // items displayed to the user after each local edit, BEFORE storing in localstorage
  const [filteredItems, setFilteredItems] = useState<TodoItem[]>(data)
  // items edited by the user, available to be stored / reset
  const [editedItems, setEditedItems] = useState<TodoItem[]>([])

  const [title, setTitle] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])
  const [uniqueCategories, setUniqueCategories] = useState<string[]>(uniqueCats)
  const [status, setStatus] = useState<Status>(Status.NEW)
  const [deadline, setDeadline] = useState<Date | null>(new Date())

  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [checkInput, setCheckInput] = useState<boolean>(false)
  const [checkEdit, setCheckEdit] = useState<boolean>(false)
  const [sortType, setSortType] = useState<string>("asc")

  const { displayedItems, tablePages } = usePagination({
    items: filteredItems,
    currentPage,
    rowsPerPage,
    sortType,
  })

  const [notification, setNotification] = useState<JSX.Element | undefined>(
    undefined
  )
  const [userEnquiry, setUserEnquiry] = useState<JSX.Element | undefined>(
    undefined
  )

  // validate user input for new item
  useEffect(() => {
    if (!checkInput) {
      return
    }

    const inputErrors: JSX.Element[] = []
    if (!title.trim().length) {
      inputErrors.push(
        <li key='error-add-title'>Bitte einen Namen eingeben</li>
      )
    } else if (title.length > 120) {
      inputErrors.push(
        <li key='error-add-title-length'>
          Der Name darf maximal 120 Zeichen enthalten
        </li>
      )
    }
    if (deadline === null) {
      inputErrors.push(
        <li key='error-add-deadline'>Bitte die Deadline eingeben</li>
      )
    }
    if (!categories.length) {
      inputErrors.push(
        <li key='error-add-category'>
          Bitte mindestens eine Kategorie eingeben
        </li>
      )
    } else if (categories.length > 8) {
      inputErrors.push(
        <li key='error-add-too-many-categories'>
          Maximal 8 Kategorien erlaubt
        </li>
      )
    }
    if (inputErrors.length) {
      setNotification(
        <ul className='list-disc ml-4'>{inputErrors.map((error) => error)}</ul>
      )
    } else {
      setNotification(undefined)
    }
  }, [title, categories, checkInput, deadline, status])

  // validate user input for edited item
  useEffect(() => {
    if (!checkEdit) {
      return
    }

    const invalidEditedItem = editedItems.find(
      (e) =>
        !isInputValid({
          item: e,
        })
    )
    if (!invalidEditedItem) {
      setNotification(undefined)
      return
    }

    const editErrors: JSX.Element[] = []
    if (!invalidEditedItem.title.trim().length) {
      editErrors.push(
        <li key='error-edit-title'>Bitte einen Namen eingeben</li>
      )
    } else if (invalidEditedItem.title.length > 120) {
      editErrors.push(
        <li key='error-edit-title-length'>
          Der Name darf maximal 120 Zeichen enthalten
        </li>
      )
    }

    if (editErrors.length) {
      setNotification(
        <ul className='list-disc ml-4'>{editErrors.map((error) => error)}</ul>
      )
    } else {
      setNotification(undefined)
    }
  }, [editedItems, checkEdit])

  const onAddItem = (newItem: TodoItem) => {
    const localItems = localStorage.getItem("items")
    const formerItems = localItems ? JSON.parse(localItems) : []
    let newData: TodoItem[]

    if (formerItems.length) {
      newData = [...formerItems, newItem]
    } else {
      newData = [newItem]
    }

    localStorage.setItem("items", JSON.stringify(newData))
    setItems(newData)
    setFilteredItems(newData)
    setCategories([])
    setUniqueCategories((prev) => [
      ...prev,
      ...newItem.categories.filter((cat) => !uniqueCategories.includes(cat)),
    ])
    setStatus(Status.NEW)
    setDeadline(new Date())
    setRowsPerPage(newData.length > 10 ? 10 : newData.length)
  }

  const onEditItem = () => {
    const localItems: string | null = localStorage.getItem("items")
    const formerItems: TodoItem[] = localItems ? JSON.parse(localItems) : []
    const newItems: TodoItem[] = [...formerItems]

    const editedCategories: string[] = []
    editedItems.forEach((edited) => {
      const i = formerItems.findIndex((f) => f.id === edited.id)
      newItems[i] = edited
      editedCategories.push(...edited.categories)
    })

    const formerCategories = formerItems.flatMap((item) => item.categories)
    const newCategories = newItems
      .flatMap((n) => n.categories)
      .filter((cat, i, arr) => arr.indexOf(cat) === i)
    const newFilteredCategories = newCategories.filter((n) =>
      formerCategories.find((f) => f !== n)
    )
    setUniqueCategories(newFilteredCategories)

    localStorage.setItem("items", JSON.stringify(newItems))
    setItems(newItems)
    setFilteredItems(newItems)
    setEditedItems([])
  }

  const onDeleteItems = (ids: string[]) => {
    const localItems = localStorage.getItem("items")
    const formerItems: TodoItem[] = localItems ? JSON.parse(localItems) : []
    const newData = formerItems.filter((item) => !ids.includes(item.id))
    localStorage.setItem("items", JSON.stringify(newData))
    setItems(newData)
    setFilteredItems(newData)
    setUniqueCategories((prev) => [
      ...prev.filter((p) => newData.find((n) => n.categories.includes(p))),
    ])
    setNotification(undefined)
  }

  const onResetItem = (item: TodoItem) => {
    const originalItem = items.find((p) => p.id === item.id)
    setFilteredItems((prevItems) =>
      prevItems.map((prev) => {
        if (prev.id === item.id) {
          return originalItem as TodoItem
        }
        return prev
      })
    )
    setEditedItems((prevItems) => prevItems.filter((p) => p.id !== item.id))
  }

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase()
    setFilteredItems(
      items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchValue) ||
          item.status.toLowerCase().includes(searchValue) ||
          item.categories.find((cat) => cat.toLowerCase().includes(searchValue))
      )
    )
  }

  const sortTableData = (colName: string, type: string) => {
    setSortType(type)
    setFilteredItems(
      filteredItems.sort((a, b) => {
        switch (colName) {
          case "Name":
            return type === "asc"
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title)
          case "Status":
            return type === "asc"
              ? a.status.localeCompare(b.status)
              : b.status.localeCompare(a.status)
          case "Deadline": {
            const dateA = new Date(a.deadline).toLocaleDateString()
            const dateB = new Date(b.deadline).toLocaleDateString()
            return type === "asc"
              ? dateA.localeCompare(dateB)
              : dateB.localeCompare(dateA)
          }
          default:
            return -1
        }
      })
    )
  }

  const tableHead: TableHead[] = [
    { title: "Name", className: "w-60" },
    { title: "Status", className: "w-40" },
    {
      title: "Kategorien",
      className: "w-60",
    },
    { title: "Deadline", className: "w-40" },
    {
      title: "Aktionen",
      className: "w-[210px]",
    },
  ]

  const addItemRow = (
    <AddItemRow
      key='add-todo-item'
      items={items}
      title={title}
      setTitle={setTitle}
      category={category}
      setCategory={setCategory}
      categories={categories}
      setCategories={setCategories}
      uniqueCategories={uniqueCategories}
      setUniqueCategories={setUniqueCategories}
      status={status}
      setStatus={setStatus}
      deadline={deadline}
      setDeadline={setDeadline}
      datePicker={
        <DatePicker
          selected={deadline}
          onChange={(date) => setDeadline(date)}
          customInput={
            <input className='w-24 h-8 py-0 px-1 mr-2 border-none rounded-md' />
          }
          dayClassName={(date) => getDayClassName(date, new Date(deadline!))}
          fixedHeight
        />
      }
      setCheckInput={setCheckInput}
      setNotification={setNotification}
      onAddItem={onAddItem}
    />
  )

  const tableBody = displayedItems.map((item, i) => (
    <TableRow
      key={`item-element-${i}`}
      displayedItem={item}
      i={i + 1}
      uniqueCategories={uniqueCategories}
      setFilteredItems={setFilteredItems}
      editedItems={editedItems}
      setEditedItems={setEditedItems}
      setCheckEdit={setCheckEdit}
      setNotification={setNotification}
      setUserEnquiry={setUserEnquiry}
      onEditItem={onEditItem}
      onDeleteItems={onDeleteItems}
      onResetItem={onResetItem}
    />
  ))

  const renderAddCategoryList = () =>
    categories.map((s, i) => (
      <div
        key={`add-category-${i}`}
        className='w-fit flex items-start my-1 rounded-md border border-gray-600 shadow-sm text-black'
      >
        <p className='px-1 py-0.5'>{s}</p>
        <button
          type='button'
          title='Löschen'
          className='hover:text-gray-500'
          onClick={() =>
            setCategories((prev) => prev.filter((prev) => prev !== s))
          }
        >
          <XMarkIcon strokeWidth='1.5' className='h-4 w-4' aria-hidden='true' />
        </button>
      </div>
    ))

  if (categories.length) {
    tableBody.unshift(
      <tr key='categories-row'>
        <td colSpan={5} className='h-fit pb-2 shadow-md'>
          <div key='categories-container' className='flex px-4 space-x-2'>
            {renderAddCategoryList()}
          </div>
        </td>
      </tr>
    )
  }

  tableBody.unshift(addItemRow)

  const renderDeleteTableItemsButton = () => (
    <DeleteTableItemsButton
      items={items}
      onDeleteItems={onDeleteItems}
      setNotification={setNotification}
      setUserEnquiry={setUserEnquiry}
    />
  )

  const renderNotification = () =>
    notification ? (
      <div className={enquiryContainerClassName}>
        <div className={notificationClassName}>{notification}</div>
      </div>
    ) : null

  const renderUserEnquiry = () =>
    userEnquiry ? (
      <div className={enquiryContainerClassName}>{userEnquiry}</div>
    ) : null

  const renderTableArea = () => (
    <div className='w-full flex flex-col-reverse lg:flex-row select-none'>
      <div className={maxWidth}>
        <div className='pt-4 px-4 pb-2 rounded-md lg:shadow'>
          <div className='flex justify-between'>
            <TableSearchInput
              placeholder='Todos durchsuchen'
              onChange={onSearchInput}
            />
            <DateFilter
              items={items}
              setFilteredItems={setFilteredItems}
              setNotification={setNotification}
            />
          </div>
          <Table
            data={displayedItems}
            head={tableHead}
            body={tableBody}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            tablePages={tablePages}
            totalNumberOfItems={items.length}
            sortTableData={sortTableData}
            hideEmptyRows
          />
        </div>
        <div className={`${maxWidth} flex justify-end space-x-2 mt-4 pb-8`}>
          {renderDeleteTableItemsButton()}
        </div>
      </div>
      {renderNotification()}
      {renderUserEnquiry()}
    </div>
  )

  return <div className='mr-4'>{renderTableArea()}</div>
}
