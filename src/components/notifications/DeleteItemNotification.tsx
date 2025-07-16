import { Dispatch, JSX, SetStateAction } from "react"
import {
  buttonClassName,
  buttonClassNamePrimary,
  notificationClassName,
} from "../../utilities"

export interface DeleteItemNotificationProps {
  onClick: () => void
  setUserEnquiry: Dispatch<SetStateAction<JSX.Element | undefined>>
}

export const DeleteItemNotification = ({
  onClick,
  setUserEnquiry,
}: DeleteItemNotificationProps) => {
  return (
    <div className={notificationClassName}>
      <p>Möchtest du diesen Eintrag wirklich löschen?</p>
      <div className='flex justify-end space-x-2 mt-4'>
        <button
          className={buttonClassName}
          onClick={() => setUserEnquiry(undefined)}
        >
          Abbrechen
        </button>
        <button className={buttonClassNamePrimary} onClick={onClick}>
          Löschen
        </button>
      </div>
    </div>
  )
}
