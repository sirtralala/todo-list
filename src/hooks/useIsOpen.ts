import { RefObject, useCallback, useEffect, useState } from "react"

export function useIsOpen(
  node: RefObject<HTMLDivElement | null>,
  initOpen?: boolean
) {
  const [isOpen, setIsOpen] = useState<boolean>(initOpen ? initOpen : false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickOutside = (event: any) => {
    if (
      event.composedPath().includes(node.current) ||
      event.target.parentElement.role === "menuitem" ||
      event.target.parentElement.parentElement?.role === "menuitem"
    ) {
      // inside click
      return
    }
    // outside click
    close()
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      console.log("escape click")
      close()
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false)
    return () => {
      document.removeEventListener("keydown", escFunction, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isOpen, node, open, close }
}
