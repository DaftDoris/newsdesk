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
  // itemList: Item[]
  // slotTitleList: string[]
}

export const useShareStore = defineStore("share", {
  state: (): State => ({
    // itemList: [],
    // slotTitleList: [],
  }),
  actions: {
    async sendItem(item: Item, podcastname: string) {
      const db = getFirestore()
      const docRef = doc(collection(db, podcastname), docname)
      return setDoc(docRef, {
        items: this.itemList,
        slotTitles: this.slotTitleList,
      })
    },
  },
  getters: {},
})
