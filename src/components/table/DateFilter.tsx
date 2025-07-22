import DatePicker from "react-datepicker"
import { buttonClassName, getDayClassName } from "../../utilities"
import { Dispatch, JSX, SetStateAction, useState } from "react"
import { TodoItem } from "../../types"
import "./styles.css"

interface DateFilterProps {
  items: TodoItem[]
  setFilteredItems: Dispatch<SetStateAction<TodoItem[]>>
  setNotification: Dispatch<SetStateAction<JSX.Element | undefined>>
}

export const DateFilter = ({
  items,
  setFilteredItems,
  setNotification,
}: DateFilterProps) => {
  const customDateInput = (
    <input className='w-24 h-8 py-0 px-1 mr-2 border-none rounded-md' />
  )

  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  const [isFilteredByDeadline, setIsFilteredByDeadline] =
    useState<boolean>(false)

  return (
    <div className='h-8 flex justify-end grow mt-1 mr-1 lg:mr-6'>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        customInput={customDateInput}
        dayClassName={(date) => getDayClassName(date, startDate)}
        fixedHeight
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        customInput={customDateInput}
        dayClassName={(date) => getDayClassName(date, endDate)}
        fixedHeight
      />
      <button
        type='button'
        className={`w-[171px] ${buttonClassName}`}
        disabled={startDate === null || endDate === null}
        onClick={() => {
          if (isFilteredByDeadline) {
            setFilteredItems(items)
            setIsFilteredByDeadline(false)
            return
          }
          setNotification(undefined)
          setIsFilteredByDeadline(true)
          setFilteredItems(
            items.filter((item) => {
              const start =
                startDate!.getTime() - (startDate!.getTime() % 86400000)
              const end = endDate!.getTime() - (endDate!.getTime() % 86400000)
              const deadline =
                new Date(item.deadline).getTime() -
                (new Date(item.deadline).getTime() % 86400000)

              return deadline >= start && deadline <= end
            })
          )
        }}
      >
        {isFilteredByDeadline ? "Filter aufheben" : "Nach Zeitraum filtern"}
      </button>
    </div>
  )
}
