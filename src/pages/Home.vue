<template>
  <main
    v-show="initiated && isAuthenticated"
    class="h-full grid grid-cols-5 gap-4 divide-x"
  >
    <div class="px-4">
      <h2 class="text-2xl dark:text-white">Longer List</h2>
      <p>coming soon...</p>
    </div>
    <div class="px-4 mt-4 col-span-3">
      <section
        v-for="slot in Array.from({ length: 7 }, (_, i) => 7 - i)"
        :key="slot"
        :slotno="slot"
      >
        <SlotTitleInput
          v-model="itemStore.getSlotTitleList[slot]"
          :slotno="slot"
          :updateEvent="events.onUpdateSaveDoc"
        />
        <InputCard @save="events.onClickSave" :slot="slot" />
        <List>
          <template v-for="item in itemStore.getSlotList(slot)" :key="item.id">
            <ListItem>
              <ItemCard
                :item="item"
                @delete="events.onClickDelete"
                @toggle="events.onClickToggle"
                @update="events.onClickUpdate"
                @dragged="dragged"
              />
            </ListItem>
          </template>
        </List>
      </section>
    </div>
    <div class="px-4">
      <h2 class="text-2xl dark:text-white">Script</h2>
      <p>coming soon...</p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from "vue"
import { storeToRefs } from "pinia"
import { useAuthStore } from "@/store/auth"
import { useItemStore } from "@/store/item"
import { Item } from "@/types/item"

import List from "@/components/atoms/List.vue"
import ListItem from "@/components/atoms/ListItem.vue"
import ItemCard from "@/components/molecules/Cards/ItemCard.vue"
import InputCard from "@/components/molecules/Cards/InputCard.vue"
import SlotTitleInput from "@/components/atoms/SlotTitleInput.vue"

const authStore = useAuthStore()
const itemStore = useItemStore()

const initiated = ref(false)

const { user, isAuthenticated } = storeToRefs(authStore)

// @TODO: work with todays date
const docname = window.location.host === "localhost:3000" ? "todaysdate2" : "todaysdate"
const podcastname = "smartseven"

const dragged = (x:number, y:number, item:Item) => {
  const slot = <Item["slot"]>(
    parseInt(<string>
    // @ts-ignore
      document.elementFromPoint(x, y)?.closest("section")?.attributes["slotno"]
        ?.value,
    )
  )
  if (slot) {
    item.slot = slot
    itemStore.saveData(podcastname, docname)
  }
}

watch(
  isAuthenticated,
  async (authenticated) => {
    if (authenticated) {
      await itemStore.connect(podcastname, docname)
      initiated.value = true
    }
  },
  {
    immediate: true,
  },
)

const events = {
  onClickSave(text: string, slot: Item["slot"]) {
    itemStore.addItem({ text, slot }, podcastname, docname)
  },
  onUpdateSaveDoc() {
    itemStore.saveData(podcastname, docname)
  },
  onClickDelete(item: Item) {
    itemStore.removeItem(item, podcastname, docname)
  },
  onClickUpdate(item: Item) {
    itemStore.updateItem(item, podcastname, docname)
  },
  onClickToggle(item: Item) {
    item.shared = !item.shared
    itemStore.updateItem(item, podcastname, docname)
  },
}
</script>

<style scoped lang="scss">
h2 {
  @apply ss-furniture;
}
</style>
