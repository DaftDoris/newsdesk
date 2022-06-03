import { nanoid } from "nanoid"
import { defineStore } from "pinia"
import { Item } from "@/types/item"

import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayRemove,
} from "firebase/firestore"

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
      this.saveData(podcastname, docname)
    },

    async updateSlotItem(item: [], podcastname: string, docname: string) {
      this.itemList = item
      return this.saveData(podcastname, docname)
    },

    async removeItem(item: Item, podcastname: string, docname: string) {
      const docRef = doc(collection(db, podcastname), docname)
      await updateDoc(docRef, {
        items: arrayRemove(item),
      })
    },

    async updateItem(item: Item, podcastname: string, docname: string) {
      //TODO: update only the individual item
      return this.saveData(podcastname, docname)
    },

    async saveData(podcastname: string, docname: string) {
      const docRef = doc(collection(db, podcastname), docname)
      try {
        await updateDoc(docRef, {
          items: this.itemList,
          slotTitles: this.slotTitleList,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.code === "not-found" && e.name === "FirebaseError") {
          await setDoc(docRef, {
            items: this.itemList,
            slotTitles: this.slotTitleList,
          })
        } else throw e
      }
    },

    connect(podcastname: string, docname: string) {
      onSnapshot(doc(db, podcastname, docname), (doc) => {
        this.slotTitleList = (
          doc.data()?.slotTitles.length > 0
            ? doc.data()?.slotTitles
            : Array.from({ length: 7 }, () => "") ??
              Array.from({ length: 7 }, () => "")
        ) as string[]
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
