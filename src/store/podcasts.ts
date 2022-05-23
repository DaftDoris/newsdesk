import { defineStore } from "pinia"
import { collection, doc, getFirestore, getDoc } from "firebase/firestore"
export interface podcasts {
  id: string
  name: string
}
interface State {
  podcasts: podcasts[]
  readAccessPodcasts: podcasts[]
}
export const usePodcastStore = defineStore("podcasts", {
  state: (): State => ({
    podcasts: [
      { id: "smartseven", name: "old smartseven" },
      { id: "smart7", name: "The Smart 7: UK" },
      { id: "smart7ireland", name: "The Smart 7: Ireland" },
      { id: "smart7germany", name: "The Smart 7: Germany" },
      { id: "heart7", name: "The Heat 7" },
      { id: "tsn7us", name: "TSN7: US" },
      { id: "tsn7uk", name: "TSN7: UK" },
      { id: "tsn7aus", name: "TSN7: AUS" },
      { id: "blipblip", name: "Blip Blip!" },
      { id: "dev", name: "dev sandbox" },
      { id: "dev2", name: "dev 2 sandbox" },
      { id: "dev3", name: "dev 3 sandbox" },
    ],
    readAccessPodcasts: [],
  }),
  getters: {
    getPodcasts: (state: State) => state.podcasts,
    getReadAccessPodcasts: (state: State) => state.readAccessPodcasts,
  },
  actions: {
    async getReadAccessPodcast() {
      this.readAccessPodcasts = []
      const db = getFirestore()
      this.podcasts.map(async (el) => {
        await getDoc(doc(collection(db, el.id)))
          .then((res) => {
            if (res) {
              this.readAccessPodcasts.push(el)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },
  },
})
