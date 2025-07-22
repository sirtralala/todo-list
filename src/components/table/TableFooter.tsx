import { JSX, useEffect } from "react"
import { TodoItem } from "../../types"

interface TableFooterProps {
  pages: number
  setCurrentPage: (arg: number) => void
  currentPage: number
  displayedItems: TodoItem[]
  totalNumberOfItems: number
  colSpan: number
}

export const TableFooter = ({
  pages,
  setCurrentPage,
  currentPage,
  displayedItems,
  totalNumberOfItems,
  colSpan,
}: TableFooterProps) => {
  useEffect(() => {
    if (displayedItems.length < 1 && currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, displayedItems])

  const renderPageButtons = () => {
    const pageButtons: JSX.Element[] = []
    for (let i = 0; i < pages; i++) {
      pageButtons.push(
        <button
          key={`page-button-${i}`}
          onClick={() => setCurrentPage(i + 1)}
          className={`w-8 m-1 p-1 border text-sm font-normal rounded-md
                      ${
                        currentPage === i + 1
                          ? "bg-red-700 border-red-700 text-white"
                          : "bg-white text-black border-gray-500 hover:text-opacity-60 hover:border-opacity-70"
                      }`}
        >
          {i + 1}
        </button>
      )
    }
    return pageButtons
  }

  return (
    <tfoot className='w-full relative'>
      <tr key='table-footer-row'>
        <td colSpan={colSpan} className='p-1 pt-3 text-center'>
          {displayedItems.length && pages > 1 ? (
            <div className='flex justify-center'>
              <button
                key='page-button-back'
                className='w-8 font-normal mx-2'
                onClick={() =>
                  setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
                }
              >
                {"<"}
              </button>
              <div className='flex flex-wrap justify-center'>
                {renderPageButtons()}
              </div>
              <button
                key='page-button-next'
                className='w-8 font-normal mx-2'
                onClick={() =>
                  setCurrentPage(currentPage < pages ? currentPage + 1 : pages)
                }
              >
                {">"}
              </button>
            </div>
          ) : (
            <div style={{ height: "28.75px" }}></div>
          )}
        </td>
      </tr>
      <tr key='table-footer-row-entries'>
        <td
          colSpan={colSpan}
          className='p-1 mt-3 mr-6 text-right text-sm font-semibold text-black'
        >
          <p>{`${displayedItems.length} / ${totalNumberOfItems} Todo${
            totalNumberOfItems > 1 ? "s" : ""
          }`}</p>
        </td>
      </tr>
    </tfoot>
  )
}
