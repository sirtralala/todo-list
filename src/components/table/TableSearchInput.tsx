interface TableSearchInputProps {
  placeholder: string
  className?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const TableSearchInput = ({
  placeholder,
  className = "",
  onChange,
}: TableSearchInputProps) => (
  <input
    type='text'
    id='search'
    onChange={onChange}
    placeholder={placeholder}
    className={`w-1/2 h-10 px-2 border border-gray-500 rounded-md focus:border-gray-400 focus:outline-none focus:ring-red-600 ${className}`}
  ></input>
)
