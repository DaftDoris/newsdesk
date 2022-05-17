import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { Provider } from "@/types/auth"
import { Nullable } from "@/types/base"
import {
  AuthProvider,
  browserLocalPersistence,
  User,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  connectAuthEmulator,
} from "firebase/auth"
import { FirebaseApp } from "firebase/app"

export interface IUser {
  nickName?: string
  profileImage?: string
  thumbnailImage?: string
  userId?: string
}

export const useAuthStore = defineStore("auth", function () {
  const userRef = ref<Nullable<IUser>>(null)
  const provider = ref<Nullable<Provider>>(null)
  const isAuthenticated = computed<boolean>(() => userRef.value !== null)

  function saveUserToStore(user: Nullable<User>, providedBy?: Provider) {
    if (!user) {
      userRef.value = null
      return
    }

    user = user as User

    userRef.value = {
      userId: user.uid,
      profileImage:
        user.photoURL ??
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbADKB5OER8mK9MCrkCBFJeXc2pZCGucLNxA&usqp=CAU",
      thumbnailImage:
        user.photoURL ??
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbADKB5OER8mK9MCrkCBFJeXc2pZCGucLNxA&usqp=CAU",
      nickName: user.displayName ?? "Anonymous",
    }

    if (providedBy) {
      provider.value = providedBy
    }
  }

  function emulator(auth: any) {
    if (!auth?.emulatorConfig && window.location.hostname === "localhost") {
      connectAuthEmulator(auth, "http://localhost:9099")
    }
  }

  async function loginWithFirebase(
    provider: AuthProvider,
    providedBy: Provider,
  ) {
    const auth = getAuth()

    emulator(auth)

    await auth.setPersistence(browserLocalPersistence)

    if (auth.currentUser) return saveUserToStore(auth.currentUser, providedBy)

    const userCredential = await getRedirectResult(auth)
    console.log(userCredential)
    if (userCredential === null) return signInWithRedirect(auth, provider)
    console.log("providedBy", providedBy)
    saveUserToStore(userCredential.user, providedBy)
  }



  async function checkAuth() {
    const auth = getAuth()
    emulator(auth)

    await auth.setPersistence(browserLocalPersistence)
    if (!auth.currentUser) return
    saveUserToStore(auth.currentUser, "Google")
  }

  async function logout() {
    saveUserToStore(null)
    await getAuth().signOut()
    localStorage.clear()
  }

  return {
    user: userRef,
    provider,
    isAuthenticated,
    checkAuth,
    logout,
    loginWithFirebase,
  }
})
