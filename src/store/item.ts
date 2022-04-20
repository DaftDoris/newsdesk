import { nanoid } from "nanoid"
import { defineStore } from "pinia"
import { Item } from "@/types/item"

import {
  collection,
  doc,
  getFirestore,
  setDoc,
  onSnapshot,
} from "firebase/firestore"

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
      const shared = false
      const item: Item = { ...params, id, shared }

      this.itemList.push(item)
      return this.saveData(podcastname, userId)
    },

    async removeItem(item: Item, podcastname: string, userId: string) {
      const index = this.itemList.findIndex((x) => x.id === item.id)

      if (index < 0) throw new Error(`Can't find item [${item.id}]`)

      this.itemList.splice(index, 1)
      //TODO: remove only the individual item
      return this.saveData(podcastname, userId)
    },

    async updateItem(item: Item, podcastname: string, userId: string) {
      //TODO: update only the individual item
      return this.saveData(podcastname, userId)
    },

    async saveData(podcastname: string, userId: string) {
      const db = getFirestore()
      const docRef = doc(collection(db, podcastname), userId)
      return setDoc(docRef, { items: this.itemList })
    },

    connect(podcastname: string, userId: string) {
      const db = getFirestore()

      onSnapshot(doc(db, podcastname, userId), (doc) => {
        this.itemList = (doc.data()?.items ?? []) as Item[]
      })
    },
  },
  getters: {
    getList: (state: State) => state.itemList,
    getSlotList: (state) => {
      return (slot: number) =>
        state.itemList.filter((item) => item.slot === slot)
    },
  },
})
