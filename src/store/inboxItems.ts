import { defineStore } from "pinia"
import { Item } from "@/types/item"
import { usePodcastStore } from "@/store/podcasts"

import { doc, getFirestore, onSnapshot } from "firebase/firestore"

interface inboxItem {
  id: string
  name: string
  slotTitles: string[]
  items: Item[]
}

interface State {
  inboxItems: inboxItem[]
}

export const useInboxItemsStore = defineStore("inboxItems", {
  state: (): State => ({
    inboxItems: usePodcastStore().getPodcasts.map((podcast) => ({
      id: podcast.id,
      name: podcast.name,
      slotTitles: [],
      items: [],
    })),
  }),
  actions: {
    connect(docname: string) {
      const db = getFirestore()
      usePodcastStore().getPodcasts.forEach((podcast, i) =>
        onSnapshot(doc(db, podcast.id, docname), (doc) => {
          this.inboxItems[i] = {
            slotTitles: (doc.data()?.slotTitles ?? []) as string[],
            items: (doc.data()?.items.reverse() ?? []) as Item[],
            ...podcast,
          }
        }),
      )
    },
  },
  getters: {
    getInboxList: (state: State) => state.inboxItems,
  },
})
