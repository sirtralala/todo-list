import { JSX } from "react"
import { ChevronDownIcon } from "../../icons"
import { TableFooter } from "./TableFooter"
import { TodoItem } from "../../types"
import { tdClassName, thClassName, trClassName } from "../../utilities"

export interface TableHead {
  title: string
  className: string
}

interface TableProps {
  data: TodoItem[]
  head: TableHead[]
  body: JSX.Element[]
  rowsPerPage: number
  tablePages: number
  currentPage: number
  setCurrentPage: (arg: number) => void
  totalNumberOfItems: number
  sortTableData: (colName: string, type: string) => void
  hideFooter?: boolean
  hideEmptyRows?: boolean
  height?: string
}

export const Table = ({
  data,
  head,
  body,
  rowsPerPage,
  tablePages,
  currentPage,
  setCurrentPage,
  sortTableData,
  totalNumberOfItems,
  hideFooter = false,
  hideEmptyRows = false,
  height,
}: TableProps) => {
  const dummyRowClassName = `${
    height ? `${height} align-top border-b-2 border-gray-500` : trClassName
  } border-transparent`

  const notSortableColumns = ["Aktionen", "Kategorien"]

  const getDummyRows = () => {
    const rows = []
    const numberOfRows = rowsPerPage - (body.length ? data.length : 1)

    const noDataFoundRow = (
      <tr key={`no-data-found`} className={dummyRowClassName}>
        <td className={tdClassName + " text-center"} colSpan={head.length}>
          <div
            className={`text-white select-none${
              head.length === 3 ? " text-sm" : ""
            }`}
          >
            .
          </div>
          <div>{totalNumberOfItems ? "no-data-found" : "no-data-created"}</div>
        </td>
      </tr>
    )

    if (!body.length) {
      rows.push(noDataFoundRow)
    }

    for (let i = 0; i < numberOfRows; i++) {
      rows.push(
        <tr key={`dummy-row-${i}`} className={dummyRowClassName}>
          {head.map((item) => (
            <td
              key={`td-${item.title}`}
              className={`${tdClassName} text-white select-none`}
            >
              <div>.</div>
            </td>
          ))}
        </tr>
      )
    }
    return rows
  }

  return (
    <table
      style={{ height: height || "h-16" }}
      className='w-full border-gray-500 rounded-md'
    >
      <thead>
        <tr
          key='table-head-row'
          className='font-normal text-base text-black p-2 mb-2 leading-6 border-gray-500 whitespace-nowrap'
        >
          {head.map((item, index) => (
            <th
              key={`th-${item.title}`}
              className={`${
                index === 0
                  ? "rounded-tl-md"
                  : head.length === index + 1
                  ? "rounded-tr-md"
                  : ""
              } ${thClassName} ${item.className}`}
            >
              <div className='flex w-full justify-between'>
                {item.title}
                {!notSortableColumns.includes(item.title) ? (
                  <div className='flex items-start'>
                    <button
                      type='button'
                      title='sort-asc'
                      onClick={() => sortTableData(item.title, "asc")}
                    >
                      <ChevronDownIcon className='h-5 w-5 rotate-180' />
                    </button>
                    <button
                      type='button'
                      title='sort-desc'
                      onClick={() => sortTableData(item.title, "desc")}
                    >
                      <ChevronDownIcon className='h-5 w-5' />
                    </button>
                  </div>
                ) : null}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='mb-4'>
        {!!body.length && body}
        {!hideEmptyRows && getDummyRows()}
      </tbody>
      {hideFooter ? null : (
        <TableFooter
          pages={tablePages}
          displayedItems={data}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalNumberOfItems={totalNumberOfItems}
          colSpan={head.length}
        />
      )}
    </table>
  )
}
