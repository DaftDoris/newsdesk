import { defineStore } from "pinia"
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore"
import { Item } from "@/types/item"
import { db } from "@/plugins/firebase"

interface State {
  scriptSlotTitle: string[]
  scriptItem: Item[]
}

export const usescriptStore = defineStore("script", {
  state: (): State => ({
    scriptSlotTitle: [],
    scriptItem: [],
  }),
  actions: {
    async saveData(
      podcastname: string,
      docname: string,
      params: Item,
      slot: 1 | 2 | 3 | 4 | 5 | 6 | 7,
    ) {
      params.slot = slot
      const docRef = doc(collection(db, podcastname), docname)
      try {
        await updateDoc(docRef, {
          scriptItem: arrayUnion(params),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.code === "not-found" && e.name === "FirebaseError") {
          this.scriptItem.push(params)
          return await setDoc(docRef, {
            scriptSlotTitle: this.scriptSlotTitle,
            scriptItem: this.scriptItem,
          })
        } else throw e
      }
    },
    async updateScript(podcastname: string, docname: string, title: []) {
      const docRef = doc(collection(db, podcastname), docname)
      return await setDoc(docRef, {
        scriptSlotTitle: title,
        scriptItem: this.scriptItem,
      })
    },
    connect(podcastname: string, docname: string) {
      onSnapshot(doc(db, podcastname, docname), (doc) => {
        this.scriptSlotTitle = (
          doc.data()?.scriptSlotTitle && doc.data()?.scriptSlotTitle.length > 0
            ? doc.data()?.scriptSlotTitle
            : Array.from({ length: 7 }, () => "") ??
              Array.from({ length: 7 }, () => "")
        ) as string[]
        this.scriptItem = (doc.data()?.scriptItem ?? []) as Item[]
      })
    },
  },
  getters: {
    getScriptSlotList: (state) => {
      return (slot: number) =>
        state.scriptItem.filter((item) => item.slot === slot)
    },
    getScriptSlotTitleList: (state: State) => state.scriptSlotTitle,
  },
})
