import { defineStore } from "pinia"
import { Item } from "@/types/item"
import { usePodcastStore, podcasts } from "@/store/podcasts"
import {
  doc,
  getFirestore,
  setDoc,
  arrayUnion,
  updateDoc,
  onSnapshot,
} from "firebase/firestore"

interface State {
  inbox: { [key: string]: string[] }
}

export const useShareStore = defineStore("share", {
  state: (): State => ({
    inbox: {} as State["inbox"],
  }),
  actions: {
    async connect(podcastname: string) {
      const db = getFirestore()

      // TODO: swap this out with a collectionGroup query
      usePodcastStore().getPodcasts.forEach((podcast: podcasts) => {
        onSnapshot(
          doc(db, podcastname, "inbox", podcast.id, "shares"),
          (doc) => {
            this.inbox[podcast.id] = doc.data()?.items ?? []
          },
        )
      })
    },

    // TODO:
    // async deleteItem(item: Item, podcastname: string, from: string) {
    // })

    async sendItem(item: Item, destination: string, from: string) {
      const db = getFirestore()
      const docRef = doc(db, destination, "inbox", from, "shares")
      try {
        await updateDoc(docRef, {
          items: arrayUnion(item.text),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        // create doc if it doesn't exist
        if (e.code === "not-found" && e.name === "FirebaseError")
          await setDoc(docRef, { items: arrayUnion(item.text) })
        else throw e
      }
    },
  },
  getters: {
    getInbox: (state: State) => Object.values(state.inbox).flat(),
  },
})
