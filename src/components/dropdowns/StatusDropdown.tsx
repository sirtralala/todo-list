import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { useIsOpen } from "../../hooks/useIsOpen"
import { TodoItem, DropdownItem, Status } from "../../types"
import { ChevronDownIcon, MinusIcon } from "../../icons"
import { Dispatch, SetStateAction, useRef } from "react"

interface StatusDropdownProps {
  status: Status
  setStatus?: Dispatch<SetStateAction<Status>>
  uniqueCategories?: string[]
  setUniqueCategories?: Dispatch<SetStateAction<string[]>>
  item?: TodoItem
  editedItems?: TodoItem[]
  setEditedItems?: Dispatch<SetStateAction<TodoItem[]>>
  zIndex?: string
}

export const StatusDropdown = ({
  status,
  setStatus,
  uniqueCategories,
  setUniqueCategories,
  item,
  editedItems,
  setEditedItems,
  zIndex,
}: StatusDropdownProps) => {
  const dropdownNode = useRef(null)
  const { isOpen, open, close } = useIsOpen(dropdownNode)

  const onDropdownItemClick = (newStatus: Status) => {
    const onAddItem = () => {
      if (setStatus) {
        setStatus(newStatus)
      }
    }

    const onEditItem = () => {
      if (!item || !setEditedItems) {
        return
      }

      const newItem: TodoItem = {
        ...item,
        status: newStatus,
      }

      const editedItem = editedItems?.find((e) => e.id === item.id)
      if (!editedItem) {
        setEditedItems((prevItems) => [...prevItems, newItem])
      } else {
        setEditedItems((prevItems) =>
          prevItems.map((p: TodoItem) => {
            if (p.id === newItem.id) {
              return newItem
            }
            return p
          })
        )
      }
    }

    if (item) {
      onEditItem()
    } else {
      onAddItem()
    }
  }

  const dropdownItems: DropdownItem[] = [
    {
      key: "dropdown-item-1",
      content: <p>{Status.NEW}</p>,
      onClick: () => onDropdownItemClick(Status.NEW),
    },
    {
      key: "dropdown-item-2",
      content: <p>{Status.IN_PROGRESS}</p>,
      onClick: () => onDropdownItemClick(Status.IN_PROGRESS),
    },
    {
      key: "dropdown-item-3",
      content: <p>{Status.DONE}</p>,
      onClick: () => onDropdownItemClick(Status.DONE),
    },
  ]

  const renderDropdownItem = (item: DropdownItem) => (
    <button
      onClick={item.onClick}
      className='block w-full px-1 py-2 hover:bg-gray-100'
      role='menuitem'
    >
      {item.content}
    </button>
  )

  return (
    <Menu>
      <div
        ref={dropdownNode}
        className={`relative mt-1 ${zIndex ? zIndex : "z-80"}`}
      >
        <MenuButton
          type='button'
          className={`flex items-center cursor-pointer`}
          onClick={() => (isOpen ? close() : open())}
        >
          {uniqueCategories ? (
            <input
              type='text'
              name='table-cell-add'
              className='w-full py-0 pl-1 pr-7 border border-gray-500 rounded-md focus:border-white'
              value={status}
              onChange={(e) => {
                setStatus!(e.target.value as Status)
                if (item && setUniqueCategories) {
                  setUniqueCategories((prev) => [
                    ...prev,
                    ...item.categories.filter(
                      (cat) => !uniqueCategories.includes(cat)
                    ),
                  ])
                }
              }}
            />
          ) : (
            status
          )}
          {isOpen ? (
            <MinusIcon className='h-5 w-5 ml-1' />
          ) : (
            <ChevronDownIcon className='h-5 w-5 ml-1' />
          )}
        </MenuButton>
        <MenuItems
          anchor='bottom'
          className={`w-fit min-w-24 pt-1 ${
            dropdownItems.length > 4
              ? "h-48 overflow-x-hidden overflow-y-auto"
              : "overflow-hidden"
          } absolute rounded-md shadow-lg bg-white ${
            zIndex ? zIndex : "z-80"
          } ring-0 divide-y divide-gray-100 right-0`}
          aria-orientation='vertical'
          aria-labelledby='status-menu'
        >
          {dropdownItems.map((item, i) => (
            <MenuItem key={`dropdownItem-${i}`}>
              {renderDropdownItem(item)}
            </MenuItem>
          ))}
        </MenuItems>
      </div>
    </Menu>
  )
}
