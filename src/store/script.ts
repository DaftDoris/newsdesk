import { defineStore } from "pinia"

import { collection, doc, setDoc, onSnapshot } from "firebase/firestore"

import { db } from "@/plugins/firebase"

interface State {
  title: string
  specialDay: string
  birthdays: string
}

export const usescriptStore = defineStore("script", {
  state: (): State => ({
    title: "",
    specialDay: "",
    birthdays: "",
  }),
  actions: {
    async saveData(podcastname: string, docname: string, scriptData: State) {
      const docRef = doc(collection(db, podcastname), docname)
      return await setDoc(docRef, {
        title: scriptData.title,
        specialDay: scriptData.specialDay,
        birthdays: scriptData.birthdays,
      })
    },
    connect(podcastname: string, docname: string) {
      onSnapshot(doc(db, podcastname, docname), (doc) => {
        this.title = (doc.data()?.title ?? "") as string
        this.specialDay = (doc.data()?.specialDay ?? "") as string
        this.birthdays = (doc.data()?.birthdays ?? "") as string
      })
    },
  },
  getters: {
    getScriptData: (state: State) => {
      return {
        title: state.title,
        specialDay: state.specialDay,
        birthdays: state.birthdays,
      }
    },
  },
})
