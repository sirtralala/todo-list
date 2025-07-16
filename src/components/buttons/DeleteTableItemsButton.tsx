import { TodoItem } from "../../types"
import React, { JSX } from "react"
import { DeleteAllItemsNotification } from "../notifications/DeleteAllItemsNotification"
import { buttonClassName } from "../../utilities"

interface DeleteTableItemsButtonProps {
  items: TodoItem[]
  setDeleteItemIds: React.Dispatch<React.SetStateAction<string[]>>
  setNotification: (
    value: React.SetStateAction<JSX.Element | undefined>
  ) => void
  setUserEnquiry: (value: React.SetStateAction<JSX.Element | undefined>) => void
}

export const DeleteTableItemsButton = ({
  items,
  setDeleteItemIds,
  setNotification,
  setUserEnquiry,
}: DeleteTableItemsButtonProps) => (
  <button
    name='delete-list'
    className={buttonClassName}
    onClick={() => {
      setNotification(undefined)
      if (items.length) {
        setUserEnquiry(
          <DeleteAllItemsNotification
            items={items}
            setDeleteItemIds={setDeleteItemIds}
            setUserEnquiry={setUserEnquiry}
          />
        )
      } else {
        setNotification(<p>no-data-created</p>)
      }
    }}
  >
    Liste löschen
  </button>
)
