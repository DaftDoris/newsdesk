import { nanoid } from "nanoid"
import { defineStore } from "pinia"
import { Item } from "@/types/item"
import { usePodcastStore } from "@/store/podcasts"

import {
  collection,
  doc,
  getFirestore,
  setDoc,
  onSnapshot,
} from "firebase/firestore"

interface State {
  itemList: Item[]
  slotTitleList: string[]
}

export const useShareStore = defineStore("share", {
  state: (): State => ({
    itemList: [],
    slotTitleList: [],
  }),
  actions: {
    connect(podcastname: string, docname: string) {
      const db = getFirestore()

      onSnapshot(doc(db, podcastname, docname), (doc) => {
        this.slotTitleList = (doc.data()?.slotTitles ?? []) as string[]
        this.itemList = (doc.data()?.items ?? []) as Item[]
      })
    },

    async sendItem(
      item: Item,
      podcastname: string,
      docname: string,
      podcastNameToShare: [],
    ) {
      this.itemList.map((el) => {
        if (el.id == item.id) {
          el.sharePodcast = podcastNameToShare
          if (podcastNameToShare.length > 0) {
            el.shared = true
          } else {
            el.shared = false
          }
        }
      })
      const db = getFirestore()
      const docRefs = doc(collection(db, podcastname), docname)

      for (let i = 0; i < podcastNameToShare.length; i++) {
        let itemListForShare: Item[] = []
        let slotTitleListForShare = []
        const docRef = doc(collection(db, podcastNameToShare[i]), docname)

        onSnapshot(doc(db, podcastNameToShare[i], docname), (doc) => {
          slotTitleListForShare = (doc.data()?.slotTitles ?? []) as string[]
          itemListForShare = (doc.data()?.items ?? []) as Item[]
          const getFilterData = itemListForShare.filter(
            (itmeData) =>
              itmeData.text.toLowerCase() === item.text.toLowerCase() &&
              itmeData.slot === item.slot,
          )
          if (getFilterData.length == 0) {
            itemListForShare.push({
              id: item.id,
              text: item.text,
              shared: false,
              slot: item.slot,
              sharePodcast: [],
            })
            setDoc(docRef, {
              items: itemListForShare,
              slotTitles: slotTitleListForShare,
            })
          }
        })
      }
      return setDoc(docRefs, {
        items: this.itemList,
        slotTitles: this.slotTitleList,
      })
    },
  },
  getters: {},
})
