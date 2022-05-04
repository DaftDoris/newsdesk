import { defineStore } from "pinia"
import { Item } from "@/types/item"
import { usePodcastStore } from "@/store/podcasts"

import { doc, getFirestore, onSnapshot } from "firebase/firestore"

interface longListItem {
  id: string
  name: string
  slotTitles: string[]
  items: Item[]
}

interface State {
  itemLongList: longListItem[]
}

export const uselongListItemsStore = defineStore("longListItems", {
  state: (): State => ({
    itemLongList: usePodcastStore().getPodcasts.map((podcast) => ({
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
          this.itemLongList[i] = {
            slotTitles: (doc.data()?.slotTitles ?? []) as string[],
            items: (doc.data()?.items ?? []) as Item[],
            ...podcast,
          }
        }),
      )
    },
  },
  getters: {
    getLongList: (state: State) => state.itemLongList,
  },
})
