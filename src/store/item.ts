import { nanoid } from "nanoid"
import { defineStore } from "pinia"
import { Item } from "@/types/item"

import { collection, doc, setDoc, onSnapshot } from "firebase/firestore"

import { db } from "@/plugins/firebase"

interface State {
  itemList: Item[]
  slotTitleList: string[]
}

export const useItemStore = defineStore("item", {
  state: (): State => ({
    itemList: [],
    slotTitleList: [],
  }),
  actions: {
    async addItem(params: Item, podcastname: string, docname: string) {
      const id = nanoid()
      const item: Item = { ...params, id }

      this.itemList.push(item)
      return this.saveData(podcastname, docname)
    },

    async updateSlotItem(item: [], podcastname: string, docname: string) {
      this.itemList = item
      return this.saveData(podcastname, docname)
    },

    async removeItem(item: Item, podcastname: string, docname: string) {
      const index = this.itemList.findIndex((x) => x.id === item.id)

      if (index < 0) throw new Error(`Can't find item [${item.id}]`)

      this.itemList.splice(index, 1)
      //TODO: remove only the individual item
      return this.saveData(podcastname, docname)
    },

    async updateItem(item: Item, podcastname: string, docname: string) {
      //TODO: update only the individual item
      return this.saveData(podcastname, docname)
    },

    async saveData(podcastname: string, docname: string) {
      const docRef = doc(collection(db, podcastname), docname)
      return setDoc(docRef, {
        items: this.itemList,
        slotTitles: this.slotTitleList,
      })
    },

    connect(podcastname: string, docname: string) {
      onSnapshot(doc(db, podcastname, docname), (doc) => {
        this.slotTitleList = (doc.data()?.slotTitles ?? []) as string[]
        this.itemList = (doc.data()?.items ?? []) as Item[]
      })
    },
  },
  getters: {
    getList: (state: State) => state.itemList,
    getSlotTitleList: (state: State) => state.slotTitleList,
    getSlotList: (state) => {
      return (slot: number) =>
        state.itemList.filter((item) => item.slot === slot)
    },
  },
})
