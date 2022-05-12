import { defineStore } from "pinia"
import { Item } from "@/types/item"

import {
  collection,
  doc,
  getFirestore,
  setDoc,
  getDoc,
} from "firebase/firestore"

interface State {
  itemListToShare: Item[]
  slotTitleListToShare: string[]
  errorForSharePodcast: string
  errorStatus: boolean
}

export const useShareStore = defineStore("share", {
  state: (): State => ({
    itemListToShare: [],
    slotTitleListToShare: [],
    errorForSharePodcast: "",
    errorStatus: false,
  }),
  actions: {
    async sendItem(item: Item, docname: string, podcastNameToShare: string) {
      const db = getFirestore()
      const docRef = doc(collection(db, podcastNameToShare), docname)
      await getDoc(doc(collection(db, podcastNameToShare), docname))
        .then((getData) => {
          const itemForShare = getData.data()?.items
          const getFilterData = itemForShare.filter(
            (itmeData: { text: string; slot: number }) =>
              itmeData.text.toLowerCase() === item.text.toLowerCase() &&
              itmeData.slot === item.slot,
          )
          if (getFilterData.length == 0) {
            itemForShare.push({
              id: item.id,
              text: item.text,
              shared: false,
              slot: item.slot,
              sharePodcast: [],
            })
            setDoc(docRef, {
              items: itemForShare,
              slotTitles: getData.data()?.slotTitles,
            })
          } else {
            throw new Error(`Duplicate text found.`)
          }
        })
        .catch((error) => {
          this.errorForSharePodcast = error
          this.errorStatus = true
          setTimeout(() => {
            this.errorForSharePodcast = ""
            this.errorStatus = false
          }, 6000)
        })
    },

    async deteleSendItem(item: Item, docname: string, deletePodcastId: string) {
      const db = getFirestore()
      const docRef = doc(collection(db, deletePodcastId), docname)
      await getDoc(doc(collection(db, deletePodcastId), docname))
        .then((getData) => {
          const itemForShare = getData.data()?.items
          const index = itemForShare.findIndex(
            (x: { id: string; slot: number; shared: boolean }) =>
              x.id === item.id && x.slot === item.slot && x.shared === false,
          )
          if (index < 0)
            throw new Error(
              `Can't find item [${item.id}] in ${deletePodcastId}`,
            )
          itemForShare.splice(index, 1)
          setDoc(docRef, {
            items: itemForShare,
            slotTitles: getData.data()?.slotTitles,
          })
        })
        .catch((error) => {
          this.errorForSharePodcast = error
          this.errorStatus = true
          setTimeout(() => {
            this.errorForSharePodcast = ""
            this.errorStatus = false
          }, 6000)
        })
    },
  },
  getters: {
    getErrorForSharePodcast: (state: State) => state.errorForSharePodcast,
    getErrorStatus: (state: State) => state.errorStatus,
  },
})
