export const buttonClassName =
  "border-1 bg-white text-red-700 border-red-700 border-2 font-medium rounded-md hover:text-opacity-70 hover:border-opacity-70 hover:shadow py-1 px-2 text-sm max-w-sm"

export const buttonClassNamePrimary =
  "border-1 bg-red-700 text-white border-red-700 border-2 font-medium rounded-md hover:bg-opacity-80 hover:border-opacity-50 hover:shadow py-1 px-2 text-sm max-w-sm"

export const notificationClassName =
  "mt-2 w-auto mx-auto my-4 py-2 px-4 border-x-8 border-y-2 border-solid rounded-lg border-gray-700"

export const thClassName = "align-top px-4 py-2 font-medium text-left"

export const trClassName = "h-16 align-top border-b-2 border-gray-100"

export const tdClassName = "px-4 pt-3 text-left"

export const enquiryContainerClassName =
  "w-fit mx-auto lg:w-1/4 lg:mt-14 lg:mx-0 lg:pl-4"

export const getDayClassName = (date: Date, currentDate: Date | null) =>
  currentDate && date.toDateString() === currentDate!.toDateString()
    ? "selected_day"
    : ""
