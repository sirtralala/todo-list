import { TodoItem } from "../../types"
import React, { JSX } from "react"
import { DeleteAllItemsNotification } from "../notifications/DeleteAllItemsNotification"
import { buttonClassName } from "../../utilities"

interface DeleteTableItemsButtonProps {
  items: TodoItem[]
  onDeleteItems: (ids: string[]) => void
  setNotification: (
    value: React.SetStateAction<JSX.Element | undefined>
  ) => void
  setUserEnquiry: (value: React.SetStateAction<JSX.Element | undefined>) => void
}

export const DeleteTableItemsButton = ({
  items,
  onDeleteItems,
  setNotification,
  setUserEnquiry,
}: DeleteTableItemsButtonProps) => (
  <button
    className={buttonClassName}
    onClick={() => {
      setNotification(undefined)
      if (items.length) {
        setUserEnquiry(
          <DeleteAllItemsNotification
            items={items}
            onDeleteItems={onDeleteItems}
            setUserEnquiry={setUserEnquiry}
          />
        )
      } else {
        setNotification(<p>Noch keine Todos vorhanden</p>)
      }
    }}
  >
    Liste löschen
  </button>
)
