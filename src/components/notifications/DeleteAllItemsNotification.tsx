import { TodoItem } from "../../types"
import { Dispatch, JSX, SetStateAction } from "react"
import {
  buttonClassName,
  buttonClassNamePrimary,
  notificationClassName,
} from "../../utilities"

export interface DeleteAllItemsNotificationProps {
  items: TodoItem[]
  onDeleteItems: (ids: string[]) => void
  setUserEnquiry: Dispatch<SetStateAction<JSX.Element | undefined>>
}

export const DeleteAllItemsNotification = ({
  items,
  onDeleteItems,
  setUserEnquiry,
}: DeleteAllItemsNotificationProps) => (
  <div className={notificationClassName}>
    <p>Möchtest du wirklich die gesamte Liste löschen?</p>
    <div className='flex justify-end space-x-2 mt-4'>
      <button
        type='button'
        className={buttonClassName}
        onClick={() => setUserEnquiry(undefined)}
      >
        Abbrechen
      </button>
      <button
        type='button'
        className={buttonClassNamePrimary}
        onClick={() => {
          onDeleteItems(items.flatMap((item) => item.id))
          setUserEnquiry(undefined)
        }}
      >
        Löschen
      </button>
    </div>
  </div>
)
