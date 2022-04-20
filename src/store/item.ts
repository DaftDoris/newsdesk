import { nanoid } from "nanoid"
import { defineStore } from "pinia"
import { fetchData, saveData } from "@/utils/api"
import useAsync from "@/hooks/useAsync"
import { Item } from "@/types/item"

interface State {
  itemList: Item[]
}

export const useItemStore = defineStore("item", {
  state: (): State => ({
    itemList: [],
  }),
  actions: {
    async addItem(params: Item, podcastname: string, userId: string) {
      const id = nanoid()
      const createdAt = new Date()
      const done = false
      const item: Item = { ...params, id, createdAt, done }

      this.itemList.push(item)
      await useAsync(() => saveData(this.itemList, podcastname, userId))
    },

    async removeItem(item: Item, podcastname: string, userId: string) {
      const index = this.itemList.findIndex((x) => x.id === item.id)

      if (index < 0) throw new Error(`Can't find item [${item.id}]`)

      this.itemList.splice(index, 1)
      //TODO: remove only the individual item
      await useAsync(() => saveData(this.itemList, podcastname, userId))
    },

    async updateItem(item: Item, podcastname: string, userId: string) {
      //TODO: update only the individual item
      await useAsync(() => saveData(this.itemList, podcastname, userId))
    },

    async modifyItem(item: Item, podcastname: string, userId: string) {
      const index = this.itemList.findIndex((x) => x.id === item.id)

      if (index < 0) {
        throw new Error(`Can't find item [${item.id}]`)
      }

      this.itemList.splice(index, 1, item)
      await useAsync(() => saveData(this.itemList, podcastname, userId))
    },

    async fetchItem(podcastname: string, userId: string) {
      this.itemList = await useAsync(() => fetchData(podcastname, userId))
    },
  },
  getters: {
    getList: (state: State) => state.itemList,
    getAllList: (state): Item[] => [
      ...state.itemList.filter((x) => !x.done),
      ...state.itemList.filter((x) => x.done),
    ],
  },
})
