import { nanoid } from "nanoid"
import { defineStore } from "pinia"
import { Item } from "@/types/item"

import {
  collection,
  doc,
  getFirestore,
  setDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore"

interface State {
  itemListToShare: Item[]
  slotTitleListToShare: string[]
}

export const useShareStore = defineStore("share", {
  state: (): State => ({
    itemListToShare: [],
    slotTitleListToShare: [],
  }),
  actions: {
    async sendItem(
      item: Item,
      podcastname: string,
      docname: string,
      podcastNameToShare: [],
    ) {
      const db = getFirestore()
      const docRefs = doc(collection(db, podcastname), docname)
      for (let i = 0; i < podcastNameToShare.length; i++) {
        const docRef = doc(collection(db, podcastNameToShare[i]), docname)
        const docSnap = await getDoc(docRef)
        const itemForShare = docSnap.data()?.items
        const getFilterData = itemForShare.filter(
          (itmeData: { text: string; slot: number }) =>
            itmeData.text.toLowerCase() === item.text.toLowerCase() &&
            itmeData.slot === item.slot,
        )
        if (getFilterData.length == 0) {
          itemForShare.push({
            id: nanoid(),
            text: item.text,
            shared: false,
            slot: item.slot,
            sharePodcast: [],
          })
          setDoc(docRef, {
            items: itemForShare,
            slotTitles: docSnap.data()?.slotTitles,
          })
        }
      }
    },
  },
  getters: {},
})
