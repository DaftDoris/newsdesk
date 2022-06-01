import { defineStore } from "pinia"
import { collection, doc, getFirestore, getDoc } from "firebase/firestore"
export interface podcasts {
  id: string
  name: string
  image: string
}
interface State {
  podcasts: podcasts[]
  readAccessPodcasts: podcasts[]
}
export const usePodcastStore = defineStore("podcasts", {
  state: (): State => ({
    podcasts: [
      {
        id: "smartseven",
        name: "old smartseven",
        image: "/the-smart-7.jpg",
      },
      { id: "smart7", name: "The Smart 7: UK", image: "" },
      {
        id: "smart7ireland",
        name: "The Smart 7: Ireland",
        image: "/smart-7-ireland.jpg",
      },
      {
        id: "smart7germany",
        name: "The Smart 7: Germany",
        image: "/smart-7-germany.jpg",
      },
      { id: "heart7", name: "The Heat 7", image: "/heart-7.png" },
      { id: "tsn7us", name: "TSN7: US", image: "/tsn-7.jpg" },
      { id: "tsn7uk", name: "TSN7: UK", image: "/tsn-7-uk.jpg" },
      { id: "tsn7aus", name: "TSN7: AUS", image: "" },
      { id: "blipblip", name: "Blip Blip!", image: "/blip-blip.jpg" },
      { id: "dev", name: "dev sandbox", image: "" },
      { id: "dev2", name: "dev 2 sandbox", image: "" },
      { id: "dev3", name: "dev 3 sandbox", image: "" },
    ],
    readAccessPodcasts: [],
  }),
  getters: {
    getPodcasts: (state: State) => state.podcasts,
    getReadAccessPodcasts: (state: State) => state.readAccessPodcasts,
  },
  actions: {
    getReadAccessPodcast() {
      this.readAccessPodcasts = []
      const db = getFirestore()
      this.podcasts.map(async (el: podcasts) => {
        try {
          await getDoc(doc(collection(db, el.id)))
          this.readAccessPodcasts.push(el)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          if (e.code === "permission-denied") return e.code
          else return e
        }
      })
    },
  },
})
