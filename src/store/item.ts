import { nanoid } from "nanoid"
import { defineStore } from "pinia"
import { Item } from "@/types/item"
import { arrayMoveImmutable } from "array-move"

import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"

import { db } from "@/plugins/firebase"

interface State {
  itemList: Item[]
  scriptItemList: any[]
  slotTitleList: string[]
  title: string
  special_day: string
  birthdays: string
}

export const useItemStore = defineStore("item", {
  state: (): State => ({
    itemList: [],
    slotTitleList: [],
    title: "",
    special_day: "",
    birthdays: "",
    scriptItemList: [],
  }),
  actions: {
    async addItem(params: Item, podcastname: string, docname: string) {
      const id = nanoid()
      const item: Item = { ...params, id }
      this.itemList.push(item)
      this.saveData(podcastname, docname)
    },
    async addScriptItem(params: Item, podCastName: string, slot: any) {
      const id = nanoid()
      const item: any = { params, slot, id }
      const newDocName: string = JSON.stringify(item)
      this.scriptItemList.push(item)
      this.saveScriptData(podCastName, newDocName)
    },

    async updateSlotItem(item: [], podcastname: string, docname: string) {
      this.itemList = item
      this.saveData(podcastname, docname)
    },

    async removeItem(item: Item, podcastname: string, docname: string) {
      const docRef = doc(collection(db, podcastname), docname)
      try {
        return await updateDoc(docRef, {
          items: arrayRemove(item),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.code === "not-found" && e.name === "FirebaseError") {
          const index = this.itemList.findIndex((x) => x.id === item.id)

          if (index < 0) throw new Error(`Can't find item [${item.id}]`)

          this.itemList.splice(index, 1)
          //TODO: remove only the individual item
          return this.saveData(podcastname, docname)
        } else throw e
      }
    },
    async removeInboxItem(item: string, destination: string, from: string) {
      const docRef = doc(db, destination, "inbox", from, "shares")
      try {
        await updateDoc(docRef, {
          items: arrayRemove(item),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log(e)
      }
    },
    async updateItem(item: Item, podcastname: string, docname: string) {
      //TODO: update only the individual item
      return this.saveData(podcastname, docname)
    },
    async saveData(podcastname: string, docname: string) {
      const docRef = doc(collection(db, podcastname), docname)
      try {
        return await updateDoc(docRef, {
          items: this.itemList,
          slotTitles: this.slotTitleList,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.code === "not-found" && e.name === "FirebaseError") {
          return await setDoc(docRef, {
            items: this.itemList,
            slotTitles: this.slotTitleList,
          })
        } else throw e
      }
    },

    async saveInputSpecialDayData(podcastname: string, data: string) {
      const docRef = doc(collection(db, podcastname), 'title')
      try {
        await updateDoc(docRef, {
          special_day: data
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.code === "not-found" && e.name === "FirebaseError") {
          await setDoc(docRef, {
            special_day: data
          })
        } else throw e
      }
    },
    async saveInputTitleData(podcastname: string, data: string) {
      const docRef = doc(collection(db, podcastname), 'title')
      try {
        await updateDoc(docRef, {
          title: data
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.code === "not-found" && e.name === "FirebaseError") {
          await setDoc(docRef, {
            title: data
          })
        } else throw e
      }
    },
    async saveInputBirthdaysData(podcastname: string, data: string) {
      const docRef = doc(collection(db, podcastname), 'title')
      try {
        await updateDoc(docRef, {
          birthdays: data
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.code === "not-found" && e.name === "FirebaseError") {
          await setDoc(docRef, {
            birthdays: data
          })
        } else throw e
      }
    },
    async saveScriptData(podcastname: string, docname: string) {
      const docRef = doc(collection(db, podcastname), 'script')
      try {
        return await updateDoc(docRef, {
          items: this.scriptItemList
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.code === "not-found" && e.name === "FirebaseError") {
          return await setDoc(docRef, {
            items: this.scriptItemList,
          })
        } else throw e
      }

    },
    async getScriptListData(podcastId: string) {
      const docRef = doc(db, podcastId, "script");
      onSnapshot(doc(db, podcastId, "script"), (doc) => {
        if (doc.data()) {
          this.scriptItemList = (doc.data()?.items ?? []) as Item[]
          return doc.data()
        } else {
          this.scriptItemList = []
        }
      })

    },
    async moveClipField(indexFrom: number, position: string, podcastname: string, slot: number) {
      let sortArray = this.scriptItemList.filter((item) => item.slot === slot)
      if (position == "top") {
        sortArray = arrayMoveImmutable(
          sortArray,
          indexFrom,
          indexFrom - 1,
        )
        console.log(sortArray, 'topArray')
      } else {
        sortArray = arrayMoveImmutable(
          sortArray,
          indexFrom,
          indexFrom + 1,
        )
        console.log(sortArray, 'bottomArray')

      }
      let filteredArray = this.scriptItemList.filter((item) => item.slot != slot)
      sortArray.map((item) =>{
        filteredArray.push(item)
      })
      const docRef = doc(collection(db, podcastname), 'script')
      try {
        return await updateDoc(docRef, {
          items: filteredArray
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.code === "not-found" && e.name === "FirebaseError") {
          return await setDoc(docRef, {
            items: filteredArray,
          })
        } else throw e
      }
    },
    async deleteScriptClipField(id: string, podcastname: string){
      let selectedIndex: number = 0
      
      this.scriptItemList.map((item, index) => {
        if(item.id === id){
          selectedIndex = index
        }
      })
      this.scriptItemList.splice(selectedIndex, 1)
      const docRef = doc(collection(db, podcastname), 'script')
      try {
        return await updateDoc(docRef, {
          items: this.scriptItemList
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.code === "not-found" && e.name === "FirebaseError") {
          return await setDoc(docRef, {
            items: this.scriptItemList,
          })
        } else throw e
      }
    },
    connect(podcastname: string, docname: string) {
      onSnapshot(doc(db, podcastname, docname), (doc) => {
        this.slotTitleList = (
          doc.data()?.slotTitles && doc.data()?.slotTitles.length > 0
            ? doc.data()?.slotTitles
            : Array.from({ length: 7 }, () => "") ??
            Array.from({ length: 7 }, () => "")
        ) as string[]
        this.itemList = (doc.data()?.items ?? []) as Item[]
      })
    },
  },
  getters: {
    getList: (state: State) => state.itemList,
    getSlotTitleList: (state: State) => state.slotTitleList,
    getSlotList: (state) => {
      return (slot: number) =>
        state.itemList.filter((item) => item.slot === slot)
    },
    getScriptList: (state) => {
      return (slot: number) =>
        state.scriptItemList.filter((item) => item.slot === slot)
    },
  },
})
