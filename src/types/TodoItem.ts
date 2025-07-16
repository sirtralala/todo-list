export enum Status {
  NEW = "neu",
  IN_PROGRESS = "in Arbeit",
  DONE = "erledigt",
}

export interface TodoItem {
  id: string
  title: string
  categories: string[]
  status: Status
  deadline: string
}
