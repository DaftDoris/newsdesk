import { defineStore } from "pinia"
import { Item } from "@/types/item"
import { usePodcastStore, podcasts } from "@/store/podcasts"
import { db } from "@/plugins/firebase"

import {
  doc,
  setDoc,
  arrayUnion,
  updateDoc,
  arrayRemove,
  getDoc,
  collection,
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
      this.inbox = {}
      // TODO: swap this out with a collectionGroup query
      usePodcastStore().getPodcasts.forEach((podcast: podcasts) => {
        getDoc(
          doc(collection(db, podcastname, "inbox", podcast.id), "shares"),
        ).then((getData) => {
          this.inbox[podcast.id] = getData.data()?.items ?? []
        })
      })
    },

    async sendItem(item: Item, destination: string, from: string) {
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

    async removeDraggedItem(item: string, destination: string, from: string) {
      const docRef = doc(db, destination, "inbox", from, "shares")
      await updateDoc(docRef, {
        items: arrayRemove(item),
      })
    },
  },
  getters: {
    getInbox: (state: State) => state.inbox,
  },
})
