<template>
  <main
    v-show="initiated && isAuthenticated"
    class="h-full grid grid-cols-5 gap-4 divide-x"
  >
    <div class="px-4">
      <h2 class="text-2xl dark:text-white">Longer List</h2>
      <LongerList
      :podcastId = "podcastId"
      :docname = "docname"
      />
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
import { watch, ref } from "vue"
import { storeToRefs } from "pinia"
import { useAuthStore } from "@/store/auth"
import { useItemStore } from "@/store/item"
import { Item } from "@/types/item"

import List from "@/components/atoms/List.vue"
import ListItem from "@/components/atoms/ListItem.vue"
import LongerList from "@/components/LongerList.vue"
import ItemCard from "@/components/molecules/Cards/ItemCard.vue"
import InputCard from "@/components/molecules/Cards/InputCard.vue"
import SlotTitleInput from "@/components/atoms/SlotTitleInput.vue"

const authStore = useAuthStore()
const itemStore = useItemStore()

const initiated = ref(false)

const { user, isAuthenticated } = storeToRefs(authStore)

const props = defineProps({
  podcastId: {
    type: String,
    default: "smartseven",
  },
})

// @TODO: work with todays date
const docname = "todaysdate"

const dragged = (x: number, y: number, item: Item) => {
  const slot = <Item["slot"]>parseInt(
    <string>// @ts-ignore
    document.elementFromPoint(x, y)?.closest("section")?.attributes["slotno"]?.value,
  )
  if (slot) {
    item.slot = slot
    itemStore.saveData(props.podcastId, docname)
  }
}

const connect = () => {
  if (initiated.value) itemStore.connect(props.podcastId, docname)
}

watch(
  isAuthenticated,
  async (authenticated) => {
    if (authenticated) {
      initiated.value = true
      connect()
    }
  },
  {
    immediate: true,
  },
)

watch(() => props.podcastId, connect, {
  immediate: true,
})

const events = {
  onClickSave(text: string, slot: Item["slot"]) {
    itemStore.addItem({ text, slot }, props.podcastId, docname)
  },
  onUpdateSaveDoc() {
    itemStore.saveData(props.podcastId, docname)
  },
  onClickDelete(item: Item) {
    if (window.confirm('Are you sure?')) {
      itemStore.removeItem(item, props.podcastId, docname)
    }
  },
  onClickUpdate(item: Item) {
    itemStore.updateItem(item, props.podcastId, docname)
  },
  onClickToggle(item: Item) {
    item.shared = !item.shared
    itemStore.updateItem(item, props.podcastId, docname)
  },
}
</script>

<style scoped lang="scss">
h2 {
  @apply ss-furniture;
}
</style>
