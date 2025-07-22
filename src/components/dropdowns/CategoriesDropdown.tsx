import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { useIsOpen } from "../../hooks/useIsOpen"
import { TodoItem, DropdownItem } from "../../types"
import { ChevronDownIcon, MinusIcon } from "../../icons"
import { Dispatch, JSX, SetStateAction, useRef } from "react"

interface CategoriesDropdownProps {
  setCategory?: Dispatch<SetStateAction<string>>
  categories?: string[]
  setCategories?: Dispatch<SetStateAction<string[]>>
  uniqueCategories: string[]
  setNotification: Dispatch<SetStateAction<JSX.Element | undefined>>
  item?: TodoItem
  editedItems?: TodoItem[]
  setEditedItems?: Dispatch<SetStateAction<TodoItem[]>>
  zIndex?: string
}

export const CategoriesDropdown = ({
  setCategory,
  categories,
  setCategories,
  uniqueCategories,
  setNotification,
  item,
  editedItems,
  setEditedItems,
  zIndex,
}: CategoriesDropdownProps) => {
  const dropdownNode = useRef(null)
  const { isOpen, open, close } = useIsOpen(dropdownNode)

  const onDropdownItemClick = (category: string) => {
    const isCategoryAlreadySelected = (categories: string[]) => {
      if (categories.find((u) => u.toLowerCase() === category.toLowerCase())) {
        setNotification(<p>Diese Kategorie existiert bereits</p>)
        close()
        return true
      }
    }
    const onAddItem = () => {
      if (categories && isCategoryAlreadySelected(categories)) {
        return
      }
      if (setCategory && setCategories) {
        setCategories((prev) => [...prev, category])
        setCategory("")
      }
    }

    const onEditItem = () => {
      if (
        !item ||
        !setEditedItems ||
        isCategoryAlreadySelected(item.categories)
      ) {
        return
      }

      const newItem: TodoItem = {
        ...item,
        categories: [...item.categories, category],
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

  const dropdownItems: DropdownItem[] = uniqueCategories.map((unique) => {
    return {
      key: `unique-${unique}`,
      content: <p>{unique}</p>,
      onClick: () => onDropdownItemClick(unique),
    }
  })

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
        className={`relative ${item ? "" : "mt-1 "}${zIndex ? zIndex : "z-80"}`}
      >
        <MenuButton
          type='button'
          className={`flex items-center cursor-pointer`}
          onClick={() => (isOpen ? close() : open())}
        >
          {isOpen ? (
            <MinusIcon className='h-5 w-5 ml-1' />
          ) : (
            <ChevronDownIcon className='h-5 w-5 ml-1' />
          )}
        </MenuButton>
        <MenuItems
          anchor='bottom end'
          className={`w-fit min-w-24 pt-1 ${
            dropdownItems.length > 4
              ? "h-48 overflow-x-hidden overflow-y-auto"
              : "overflow-hidden"
          } absolute rounded-md shadow-lg bg-white ${
            zIndex ? zIndex : "z-80"
          } ring-0 divide-y divide-gray-100 right-0`}
          aria-orientation='vertical'
          aria-labelledby='categories-menu'
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
