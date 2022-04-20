export interface Item {
  text: string
  slot: "Intro" | 1 | 2 | 3 | 4 | 5 | 6 | 7
  shared?: boolean
  createdAt?: Date
  id?: string
}
