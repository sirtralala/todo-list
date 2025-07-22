interface TableSearchInputProps {
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const TableSearchInput = ({
  placeholder,
  onChange,
}: TableSearchInputProps) => (
  <input
    type='text'
    id='search'
    onChange={onChange}
    placeholder={placeholder}
    className='w-1/3 h-10 px-2 mb-4 border border-gray-500 rounded-md focus:border-gray-400 focus:outline-none'
  ></input>
)
