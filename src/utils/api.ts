import { Item } from "@/types/item"
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
} from "firebase/firestore"

async function fetchDataOnFirestore(
  podcastname: string,
  userId: string,
): Promise<Item[]> {
  const db = getFirestore()
  const docRef = doc(collection(db, podcastname), userId)
  const snapshot = await getDoc(docRef)
  const data = snapshot.data()

  return (data?.items ?? []).map((x: { createdAt: Timestamp }) => ({
    ...x,
    createdAt: x.createdAt.toDate(),
  })) as Item[]
}

async function saveDataOnFirestore(
  itemList: Item[],
  podcastname: string,
  userId: string,
): Promise<void> {
  const db = getFirestore()
  const docRef = doc(collection(db, podcastname), userId)
  await setDoc(docRef, { items: itemList })
}

export function fetchData(
  podcastname: string,
  userId: string,
): Promise<Item[]> {
  return fetchDataOnFirestore(podcastname, userId)
}

export function saveData(
  itemList: Item[],
  podcastname: string,
  userId: string,
): Promise<void> {
  return saveDataOnFirestore(itemList, podcastname, userId)
}
